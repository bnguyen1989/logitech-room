import type { ResponseType } from 'axios';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { z } from 'zod';

import { getUri } from '../../../operators/getUri.js';
import { healthcheck } from '../../../operators/healthCheck.js';
import { type ThreekitAxiosContext } from '../../../operators/HttpContext.js';
import { request } from '../../../operators/request.js';
import { type ThreekitAuthProps } from '../../../ThreekitAuthProps.js';

export const MeshCompression = z.enum(['draco', 'meshopt', 'quantize', 'none']);
export type MeshCompression = z.infer<typeof MeshCompression>;

export const ImageFormat = z.enum(['ktx2', 'webp', 'original']);
export type ImageFormat = z.infer<typeof ImageFormat>;

export const GlbOptimizeProps = z.object({
  sourceUrl: z.string(),

  dedup: z.boolean().optional(),

  prune: z.boolean().optional(),

  instance: z.boolean().optional(),
  instanceMinimum: z.number().optional(),

  simplify: z.boolean().optional(),
  simplifyError: z.number().optional(),

  meshCompression: MeshCompression.optional(),

  textureFormat: ImageFormat.optional(),
  textureSize: z.number().optional(),

  cacheScope: z.string().optional(),
  cacheMaxAge: z.number().optional()
});

export type GlbOptimizeProps = z.infer<typeof GlbOptimizeProps>;

const API_ROUTE = `api/glb`;
const API_HOST = 'glb-service.alpha.3kit.com';

export const createLocalAxios = ({ host }: { host: string }) => {
  const localAxios = axios.create({
    baseURL: 'https://' + host
  });
  localAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => error.response
  );

  return localAxios;
};

export class Glb {
  context: ThreekitAxiosContext;
  constructor(auth: ThreekitAuthProps) {
    this.context = {
      axios: createLocalAxios({ host: API_HOST }),
      auth,
      urlPrefix: API_ROUTE
    };
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  getOptimizeUrl(props: GlbOptimizeProps) {
    return getUri(this.context, {
      url: `optimize`,
      params: props
    });
  }

  optimize(
    props: GlbOptimizeProps,
    responseType: ResponseType = typeof window === 'undefined'
      ? 'stream'
      : 'blob'
  ) {
    return request(this.context, {
      url: `optimize`,
      params: props,
      responseType
    });
  }
}
