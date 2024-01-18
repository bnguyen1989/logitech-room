import type { AxiosError, AxiosResponse, CreateAxiosDefaults } from 'axios';
import axios from 'axios';

import type { ThreekitAuthProps } from './ThreekitAuthProps.js';

export const getAuthToken = (auth: ThreekitAuthProps) => {
  if ('publicToken' in auth) {
    return auth.publicToken;
  }
  if ('privateToken' in auth) {
    return auth.privateToken;
  }
  if ('cookie' in auth) {
    return auth.cookie;
  }
  throw new Error('No auth token found');
};

export const createThreekitAxios = (auth: ThreekitAuthProps) => {
  const axiosDefaults: CreateAxiosDefaults = Object.assign(
    {
      baseURL: 'https://' + auth.host
    },
    'privateToken' in auth
      ? { headers: { Authorization: `Bearer ${auth.privateToken}` } }
      : undefined,
    'cookie' in auth ? { headers: { Cookie: auth.cookie } } : undefined,
    'publicToken' in auth
      ? { params: { bearer_token: auth.publicToken } }
      : undefined
  );

  const threekitAxios = axios.create(axiosDefaults);
  threekitAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => error.response
  );

  return threekitAxios;
};
