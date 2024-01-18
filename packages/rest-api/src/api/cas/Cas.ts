import { z } from 'zod';

import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import type { Caching } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const CaseHead = z.object({
  HEAD: z.string()
});
export type CasHead = z.infer<typeof CaseHead>;

export const CasAsset = z.object({
  id: z.string(),
  type: z.union([z.literal('Node'), z.literal('Attribute')]),
  HEAD: z.string(),
  orgId: z.string().uuid()
});
export type CasAsset = z.infer<typeof CasAsset>;

export const CasObject = z.object({
  HEAD: z.string(),
  orgId: z.string().uuid(),
  objects: z.record(z.string(), z.string())
});
export type CasObject = z.infer<typeof CasObject>;

export const CasManifested = z.object({
  assets: z.array(CasAsset),
  objects: z.record(z.string(), z.string())
});
export type CasManifested = z.infer<typeof CasManifested>;

const API_ROUTE = `/api/cas`;

export class Cas extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  getById(id: string, caching: Caching = {}) {
    const assetId = z.string().uuid().parse(id);
    return getById<CasObject>(this.context, assetId, caching);
  }

  getManifestedById(id: string, caching: Caching = {}) {
    const assetId = z.string().uuid().parse(id);
    return request<CasManifested>(this.context, {
      url: `manifest/${assetId}`,
      params: caching
    });
  }

  getHeadById(id: string, caching: Caching = {}) {
    const assetId = z.string().uuid().parse(id);
    return request<CasHead>(this.context, {
      url: `${assetId}/head`,
      params: caching
    });
  }
}
