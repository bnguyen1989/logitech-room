import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const deleteById = <Listing>(
  context: ThreekitAxiosContext,
  id: string
) =>
  request<Listing>(context, {
    method: 'DELETE',
    url: id
  });
