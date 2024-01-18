import type { AxiosInstance } from 'axios';

import type { ThreekitAuthProps } from '../ThreekitAuthProps.js';

export type ThreekitAxiosContext = {
  axios: AxiosInstance;
  auth: ThreekitAuthProps;
  urlPrefix: string;
};
