import type { AxiosRequestConfig } from 'axios';

import type { ThreekitAxiosContext } from '../operators/HttpContext.js';
import { stringifyValues } from './stringyValues.js';

export const request = <T>(
  context: ThreekitAxiosContext,
  requestProps: AxiosRequestConfig
) => {
  const url = [context.urlPrefix, requestProps.url]
    .filter((value) => value && value.length > 0)
    .join('/');
  return context.axios.request<T>({
    ...requestProps,
    params: stringifyValues(requestProps.params),
    url
  });
};
