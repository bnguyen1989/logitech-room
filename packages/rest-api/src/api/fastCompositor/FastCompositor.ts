import { z } from 'zod';

import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const FastCompositeImageFitMode = z.enum([
  'cover',
  'contain',
  'fitWidth',
  'fitHeight'
]);
export type FastCompositeImageFitMode = z.infer<
  typeof FastCompositeImageFitMode
>;

export const FastCompositorImageExtension = z.enum(['png', 'jpg', 'webp']);
export type FastCompositorImageExtensions = z.infer<
  typeof FastCompositorImageExtension
>;

export const FastCompositorRequestProps = z.object({
  assetId: z.string().uuid(),
  configuration: z.record(z.string(), z.string()).optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  cropHeight: z.number().optional(),
  cropWidth: z.number().optional(),
  cropX: z.number().optional(),
  cropY: z.number().optional(),
  format: FastCompositorImageExtension.optional(),
  imageFitMode: FastCompositeImageFitMode.optional(),
  skipResolveTags: z.boolean().optional()
});
export type FastCompositorRequestProps = z.infer<
  typeof FastCompositorRequestProps
>;

const API_ROUTE = `/api/fast-compositor`;

export class FastCompositor extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  request(requestProps: FastCompositorRequestProps) {
    return request(this.context, {
      params: requestProps,
      responseType: 'blob' // TODO: This could be arraybuffer, etc.
    });
  }
}
