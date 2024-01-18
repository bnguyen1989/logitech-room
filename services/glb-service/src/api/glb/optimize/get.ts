import { Logger, NodeIO, type Transform } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  draco,
  instance,
  meshopt,
  prune,
  quantize,
  resample,
  simplify,
  sparse,
  textureCompress,
  weld
} from '@gltf-transform/functions';
import { Storage } from '@google-cloud/storage';
import draco3d from 'draco3dgltf';
import Joi from 'joi';
import {
  ready as resampleReady,
  resample as resampleWASM
} from 'keyframe-resample';
import Koa from 'koa';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

import { Mode, toktx } from '../../../gltf-transform/toktx.js';
import { bucketCache } from '../../../utils/bucketCache.js';
import { objectToMd5Hash } from '../../../utils/hashes.js';

const storage = new Storage();
const bucketName = 'threekit-packages-glb-service';

// Change this to invalidate all cached data via etag changes.
const etagContentVersion = 1;

// Configure I/O.
let _globalNodeIO: NodeIO | undefined = undefined;

const getNodeIO = async () => {
  if (_globalNodeIO === undefined) {
    _globalNodeIO = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
        'draco3d.encoder': await draco3d.createEncoderModule() // Optional.
      });
  }
  return _globalNodeIO;
};

export type MeshCompression = 'draco' | 'meshopt' | 'quantize' | 'none';
export type ImageFormat = 'ktx2' | 'webp' | 'original';

// Define the Joi schema equivalent to your Zod schema
const GlbOptimizeProps = Joi.object({
  sourceUrl: Joi.string().required(),

  dedup: Joi.boolean().default(true),
  prune: Joi.boolean().default(true),
  instance: Joi.boolean().default(true),
  instanceMinimum: Joi.number().default(2),

  simplify: Joi.boolean().default(true),
  simplifyError: Joi.number().default(0.0001),

  // Assuming MeshCompression and ImageFormat are enums or similar, you might need to adjust this part
  meshCompression: Joi.string().valid('draco').default('draco'),
  textureFormat: Joi.string().valid('webp').default('webp'),
  textureSize: Joi.number().default(1024),

  cacheScope: Joi.string().allow(null).default(null),
  cacheMaxAge: Joi.number().default(365 * 24 * 60 * 60),

  debugParseResponse: Joi.boolean().default(false)
});

export type GlbOptimizeProps = {
  sourceUrl: string;

  dedup: boolean;
  prune: boolean;
  instance: boolean;
  instanceMinimum: number;

  simplify: boolean;
  simplifyError: number;

  meshCompression: MeshCompression;
  textureFormat: ImageFormat;
  textureSize: number;

  cacheScope: string | null;
  cacheMaxAge: number;

  debugParseResponse: boolean;
};

export const getGlbOptimize = async (ctx: Koa.Context) => {
  const { error, value } = GlbOptimizeProps.validate(ctx.query);
  const params = value as Required<GlbOptimizeProps>;

  if (error) {
    const parseError = error as Joi.ValidationError;
    console.warn('ctx.query', ctx.query);
    console.warn('params', params);
    console.error({ parseError });
    ctx.throw(400, `Invalid parameters: ${parseError.message}`);
  }

  if (params.debugParseResponse) {
    // return params as JSON response
    ctx.body = params;
    ctx.status = 200;
    return;
  }

  // calculate MD5 hash of relevant query parameters.
  const etag = objectToMd5Hash({
    etagContentVersion,
    sourceUrl: params.sourceUrl,
    dedup: params.dedup,
    prune: params.prune,
    instance: params.instance,
    instanceMinimum: params.instanceMinimum,
    simplify: params.simplify,
    simplifyError: params.simplifyError,
    meshCompression: params.meshCompression,
    textureFormat: params.textureFormat,
    textureSize: params.textureSize
  });

  // check if request has an etag for its existing cached content
  const ifNoneMatch = ctx.get('If-None-Match');
  if (ifNoneMatch === etag) {
    // if the etag matches, return 304 Not Modified
    ctx.status = 304;
    return;
  }

  const fileName = `optimized-${etag}.glb`;
  const fileResult = await bucketCache(
    storage,
    bucketName,
    fileName,
    'model/gltf-binary',
    ctx,
    async (ctx: Koa.Context) => {
      const fetchSourceStart = Date.now();

      // fetch binary contents from sourceUrl.
      const sourceResponse = await fetch(params.sourceUrl);
      if (!sourceResponse.ok) {
        ctx.throw(
          sourceResponse.status,
          `Error fetching source URL: ${sourceResponse.statusText}`
        );
      }
      const sourceBuffer = await sourceResponse.arrayBuffer();
      const fetchSourceDuration = Date.now() - fetchSourceStart;
      ctx.set('X-Timing-Fetch-Source', `${fetchSourceDuration / 1000}`);
      ctx.set('X-Source-URL-Content-Length', `${sourceBuffer.byteLength}`);

      const readSourceStart = Date.now();
      const nodeIO = await getNodeIO();
      const document = await nodeIO.readBinary(new Uint8Array(sourceBuffer));

      const readSourceDuration = Date.now() - readSourceStart;
      ctx.set('X-Timing-Read-Source', `${readSourceDuration / 1000}`);

      const transforms: Transform[] = [];
      //if (enableResampleAnimation) transformSteps.push(resample());
      if (params.dedup) {
        transforms.push(dedup());
      }
      if (params.instance) {
        transforms.push(instance({ min: params.instanceMinimum }));
      }

      // Simplification and welding.
      if (params.simplify) {
        transforms.push(
          weld({ tolerance: params.simplifyError / 2 }),
          simplify({
            simplifier: MeshoptSimplifier,
            error: params.simplifyError
          })
        );
      } else {
        transforms.push(weld());
      }

      transforms.push(
        resample({ ready: resampleReady, resample: resampleWASM })
      );
      if (params.prune) {
        transforms.push(prune({ keepAttributes: false, keepLeaves: false }));
      }
      transforms.push(sparse());

      // Texture compression.
      switch (params.textureFormat) {
        case 'ktx2': {
          const slotsUASTC =
            '{normalTexture,occlusionTexture,metallicRoughnessTexture}';
          transforms.push(
            toktx({
              mode: Mode.UASTC,
              slots: slotsUASTC,
              level: 4,
              rdo: 4,
              zstd: 18
            }),
            toktx({ mode: Mode.ETC1S, quality: 255 })
          );
          break;
        }
        case 'original':
          // do nothing
          break;
        default:
          transforms.push(
            textureCompress({
              encoder: sharp,
              targetFormat: params.textureFormat,
              resize: params.textureSize
                ? [params.textureSize, params.textureSize]
                : undefined
            })
          );
          break;
      }

      // Mesh compression last. Doesn't matter here, but in one-off CLI
      // commands we want to avoid recompressing mesh data.
      switch (params.meshCompression) {
        case 'none':
          // do nothing
          break;
        case 'draco':
          transforms.push(draco());
          break;
        case 'meshopt':
          transforms.push(meshopt({ encoder: MeshoptEncoder }));
          break;
        case 'quantize':
          transforms.push(quantize());
          break;
        default:
          throw new Error(`Invalid meshCompression: ${params.meshCompression}`);
      }

      const transformStart = Date.now();
      document.setLogger(new Logger(Logger.Verbosity.SILENT));
      await document.transform(...transforms);
      const transformDuration = Date.now() - transformStart;
      ctx.set('X-Timing-Transform', `${transformDuration / 1000}`);

      const writeStart = Date.now();
      const resultBuffer = Buffer.from(await nodeIO.writeBinary(document));
      const writeDuration = Date.now() - writeStart;
      ctx.set('X-Timing-Write', `${writeDuration / 1000}`);

      return resultBuffer;
    }
  );

  ctx.response.lastModified = fileResult.lastModified;
  ctx.response.etag = etag;

  if (params.cacheScope) {
    ctx.set(
      'Cache-Control',
      `public, max-age=${params.cacheMaxAge}, immutable`
    );
  } else {
    ctx.set('Cache-Control', `public, max-age=60`);
  }

  ctx.set('Content-Length', `${fileResult.fileContent.byteLength}`);
  ctx.set('Content-Disposition', `inline; filename="${fileName}"`);
  ctx.set('ETag', etag);

  ctx.type = fileResult.mimeType;
  ctx.body = fileResult.fileContent;
};
