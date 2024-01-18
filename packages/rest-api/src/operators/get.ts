import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const get = <QueryProps, Listing>(
  context: ThreekitAxiosContext,
  queryProps?: QueryProps
) =>
  request<Listing>(context, {
    url: '',
    params: {
      ...queryProps,
      orgId: context.auth.orgId
    }
  });
