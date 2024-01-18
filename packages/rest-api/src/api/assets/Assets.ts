import { z } from 'zod';

import { deleteById } from '../../operators/deleteById.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import { restoreById } from '../../operators/restoreById.js';
import { Caching, EntityMetadata, Metadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';
import type { VariantListing } from '../variants/Variants.js';

export const Asset = EntityMetadata.merge(
  z.object({
    id: z.string(), // id may be a customID, so do not check for uuid
    name: z.string(),
    type: z.string(),
    as: z.string().nullable(),
    orgId: z.string().uuid(),
    description: z.string().nullable(),
    metadata: Metadata.nullable(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()),
    publicShare: z.string().nullable(),
    branch: z.string().optional(),
    importedFileId: z.string().nullable(),
    proxyId: z.string().uuid().nullable(),
    parentFolderId: z.string(),
    publishedAt: z.string().nullable(),
    defaultStageId: z.string().uuid().nullable(),
    defaultCompositeId: z.string().uuid().nullable(),
    nodetags: z.array(z.string()),
    proxyType: z.string().nullable(),
    effects: z.string().nullable(),
    warnings: z.boolean(),
    advancedAr: z.boolean(),
    fileSize: z.number().nullable(),
    tagids: z.array(z.string().uuid()),
    categoryId: z.string().nullable(),
    customId: z.string().nullable(),
    analytics: z.boolean()
  })
);
export type Asset = z.infer<typeof Asset>;

export const AssetListing = Pagination.merge(
  z.object({
    assets: z.array(Asset)
  })
);
export type AssetListing = z.infer<typeof AssetListing>;

export const LocaleTranslations = z.record(z.string(), z.string());
export type LocaleTranslations = z.infer<typeof LocaleTranslations>;

export const QueryAssetProps = Asset.pick({
  name: true,
  publicShare: true,
  type: true,
  importedFileId: true,
  tags: true,
  keywords: true,
  metadata: true,
  proxyId: true
})
  .merge(
    z.object({
      nameLike: z.string(),
      order: z.enum(['+createdAt', '-createdAt']).optional()
    })
  )
  .merge(Caching)
  .partial();

export type QueryAssetProps = z.infer<typeof QueryAssetProps>;
export const QueryAssetVariantProps = z
  .object({})
  .merge(Pagination)
  .merge(Caching); // TODO: This is definitely not complete.
export type QueryAssetVariantProps = z.infer<typeof QueryAssetVariantProps>;

const API_ROUTE = `/api/assets`;

export class Assets extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  get(queryProps?: QueryAssetProps) {
    return get<QueryAssetProps, AssetListing>(this.context, queryProps);
  }

  getById(id: string, caching: Caching = {}) {
    // id may be a customID, so do not check for uuid
    return getById<Asset>(this.context, id, caching);
  }

  deleteById(id: string) {
    // id may be a customID, so do not check for uuid
    return deleteById(this.context, id);
  }

  restoreById(id: string) {
    // id may be a customID, so do not check for uuid
    return restoreById(this.context, id);
  }

  cloneById(id: string) {
    // id may be a customID, so do not check for uuid
    return request(this.context, {
      url: `${id}/clone`,
      method: 'POST'
    });
  }

  getVariants(id: string, queryProps?: QueryAssetVariantProps) {
    console.warn('not handling pagination.');
    return request<VariantListing>(this.context, {
      url: `${id}/variants`,
      params: queryProps
    });
  }

  getTranslationsByLocale(locale: string, caching: Caching = {}) {
    const language = z.string().parse(locale);
    return request<LocaleTranslations>(this.context, {
      url: `translations`,
      params: {
        orgId: this.context.auth.orgId,
        locale: language,
        ...caching
      }
    });
  }
}
