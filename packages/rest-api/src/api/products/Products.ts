import { healthcheck } from '../../operators/healthCheck.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export type TranslationQueryProps = {
  assetId?: string;
};

const API_ROUTE = `/api/products`;

export class Products extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  // BEN: I removed the translation APIs as they were not on the /products route
}
