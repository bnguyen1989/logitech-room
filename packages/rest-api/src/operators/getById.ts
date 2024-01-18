import type { Caching } from '../shared.js';
import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const getById = <Record>(
  context: ThreekitAxiosContext,
  id: string,
  caching: Caching = {}
) =>
  request<Record>(context, {
    url: id,
    params: {
      orgId: context.auth.orgId,
      ...caching
    }
  });
