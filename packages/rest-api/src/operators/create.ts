import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const create = <CreateProps, Listing>(
  context: ThreekitAxiosContext,
  createProps: CreateProps
) =>
  request<Listing>(context, {
    method: 'POST',
    url: '',
    data: createProps
  });
