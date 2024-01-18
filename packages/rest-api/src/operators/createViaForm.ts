import { appendAll, type FormProps } from '../forms/FormDataHelpers.js';
import type { ThreekitAxiosContext } from './HttpContext.js';
import { request } from './request.js';

export const createViaForm = async <CreateProps extends FormProps, Listing>(
  context: ThreekitAxiosContext,
  createProps: CreateProps
) => {
  let formDataClass;
  if (typeof window === 'undefined') {
    formDataClass = (await import('formdata-polyfill/esm.min.js')).FormData;
  } else {
    formDataClass = FormData;
  }

  const formData = new formDataClass();
  appendAll(formData, createProps);
  return request<Listing>(context, {
    method: 'POST',
    url: '',
    data: formData
  });
};
