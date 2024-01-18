import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const healthcheck = (context: ThreekitAxiosContext) =>
  request<boolean>(context, {
    url: `healthcheck`
  });
