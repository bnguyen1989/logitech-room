import type { AxiosResponse } from 'axios';

export const authMissing = {
  error: {
    status: 'CUSTOM_ERROR',
    error: 'missing auth',
    data: 'missing auth'
  }
};

export const customError = {
  error: {
    status: 'CUSTOM_ERROR',
    error: 'unknown error',
    data: 'unknown error'
  }
};

export const getResponseError = (response: AxiosResponse) => ({
  error: {
    status: response.status,
    data: response.data.message,
    error: JSON.stringify(response.data)
  }
});
