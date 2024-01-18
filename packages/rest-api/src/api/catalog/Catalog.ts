import { healthcheck } from '../../operators/healthCheck.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';
import { CatalogProducts } from './products/CatalogProducts.js';

const API_ROUTE = `/api/catalog`;

export class Catalog extends Route {
  public products: CatalogProducts;

  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);

    this.products = new CatalogProducts(auth);
  }

  healthcheck() {
    return healthcheck(this.context);
  }
}
