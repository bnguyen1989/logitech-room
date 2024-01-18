import { Alpha, GlbOptimizeProps } from '@threekit/rest-api';
import { z } from 'zod';

import type {
  GLTFUrlResolver,
  GLTFUrlResolverProps
} from './GLTFUrlResolver.js';

export const OptimizeResolverWrapperProps = GlbOptimizeProps.pick({
  dedup: true,
  prune: true,

  instance: true,
  instanceMinimum: true,

  simplify: true,
  simplifyError: true,

  meshCompression: true,

  textureFormat: true,
  textureSize: true,

  cacheScope: true,
  cacheMaxAge: true
});

export type OptimizeResolverWrapperProps = z.infer<
  typeof OptimizeResolverWrapperProps
>;

export const OptimizeResolverWrapper = (
  innerResolver: GLTFUrlResolver,
  props: OptimizeResolverWrapperProps
) => {
  return async ({
    auth,
    assetId,
    configuration
  }: GLTFUrlResolverProps): Promise<string> => {
    const rawUrl = await innerResolver({ auth, assetId, configuration });
    //console.log('inner resolver glb url:', rawUrl);

    const optimizeUrl = new Alpha(auth).glb.getOptimizeUrl({
      sourceUrl: rawUrl,
      ...props
    });
    //console.log('glb optimizer url:', optimizeUrl);
    return optimizeUrl;
  };
};
