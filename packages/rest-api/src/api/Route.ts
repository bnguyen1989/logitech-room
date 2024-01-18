import { createThreekitAxios } from '../createThreekitAxios.js';
import type { ThreekitAxiosContext } from '../operators/HttpContext.js';
import type { ThreekitAuthProps } from '../ThreekitAuthProps.js';

export class Route {
  protected context: ThreekitAxiosContext;

  constructor(auth: ThreekitAuthProps, protected urlPrefix: string) {
    this.context = {
      axios: createThreekitAxios(auth),
      auth,
      urlPrefix
    };
  }
}
