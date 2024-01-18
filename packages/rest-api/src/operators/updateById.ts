import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const updateById = <UpdateProps, Listing>(
  context: ThreekitAxiosContext,
  id: string,
  updateProps: UpdateProps
) =>
  request<Listing>(context, {
    method: 'PUT',
    url: id,
    data: updateProps
  });
