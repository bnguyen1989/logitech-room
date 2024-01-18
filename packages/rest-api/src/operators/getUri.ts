import type { AxiosRequestConfig } from 'axios';

import type { ThreekitAxiosContext } from './HttpContext.js';

export const getUri = (
  context: ThreekitAxiosContext,
  requestProps: AxiosRequestConfig
) => {
  return context.axios.getUri({
    ...requestProps,
    url: (context.urlPrefix ? context.urlPrefix + '/' : '') + requestProps.url
  });
};
