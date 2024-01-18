import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const restoreById = <Record>(
  context: ThreekitAxiosContext,
  id: string
) =>
  request<Record>(context, {
    method: 'POST',
    url: `${id}/restore`
  });
