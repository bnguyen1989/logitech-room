import { z } from 'zod';

import { get } from '../../../operators/get.js';
import { getById } from '../../../operators/getById.js';
import { healthcheck } from '../../../operators/healthCheck.js';
import { Caching } from '../../../shared.js';
import type { ThreekitAuthProps } from '../../../ThreekitAuthProps.js';
import { Route } from '../../Route.js';

export const CatalogProduct = z
  .object({
    id: z.string().uuid(),
    proxyId: z.string().uuid().nullable(),
    orgId: z.string().uuid().nullable(),
    name: z.string(),
    description: z.string().nullable(),
    tags: z.array(z.string()).min(0),
    keywords: z.array(z.string()).min(0)
  })
  .merge(Caching);
export type CatalogProduct = z.infer<typeof CatalogProduct>;

export const CatalogProductListing = z.object({
  products: z.array(CatalogProduct).min(0)
});
export type CatalogProductListing = z.infer<typeof CatalogProductListing>;

export type QueryCatalogProductProps = object;

const API_ROUTE = `/api/catalog/products`;

export class CatalogProducts extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  get(queryProps?: QueryCatalogProductProps) {
    return get<QueryCatalogProductProps, CatalogProductListing>(
      this.context,
      queryProps
    );
  }

  getById(id: string, caching: Caching = {}) {
    const productId = z.string().uuid().parse(id);
    return getById<CatalogProduct>(this.context, productId, caching);
  }
}
