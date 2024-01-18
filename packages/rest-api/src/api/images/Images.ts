import { z } from 'zod';

import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const ImageTransformExtension = z.enum(['png', 'jpg', 'webp']);
export type ImageTransformExtension = z.infer<typeof ImageTransformExtension>;

export const ImageTransformProps = z.object({
  sourceUrl: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  quality: z.number().optional(),
  format: ImageTransformExtension.optional()
});
export type ImageTransformProps = z.infer<typeof ImageTransformProps>;

const API_ROUTE = `/api/images`;

export class Images extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  protected getTransformUrl(props: ImageTransformProps) {
    const { sourceUrl, width, height, quality, format } = props;
    let path = 'webp'; // this just specifies that it uses ImageMagick rather than GraphicsMagic and thus it supports webp.
    if (width !== undefined || height !== undefined) {
      path += `/${width ?? 0}`;
      path += 'x';
      path += `${height ?? 0}`;
    }
    if (format !== undefined || quality !== undefined) {
      const filters = ['filters'];
      if (format !== undefined) {
        filters.push(`format(${format})`);
      }
      if (quality !== undefined) {
        filters.push(`quality(${quality})`);
      }
      path += `/${filters.join(':')}`;
    }
    path += `/${sourceUrl}`;
    return path;
  }

  transform(props: ImageTransformProps) {
    return request(this.context, {
      url: this.getTransformUrl(props)
    });
  }
}
