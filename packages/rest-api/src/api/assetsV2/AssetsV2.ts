import { z } from 'zod';

import { create } from '../../operators/create.js';
import { deleteById } from '../../operators/deleteById.js';
import { getById } from '../../operators/getById.js';
import { EntityMetadata, Metadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const AssetV2 = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.literal('item'),
    as: z.string().nullable(),
    orgId: z.string().uuid(),
    description: z.string().nullable(),
    metadata: Metadata.nullable(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()),
    publicShare: z.string().nullable(),
    parentFolderId: z.string().nullable(), // BEN: Could be uuid or "catalog"
    importedFileId: z.string().uuid().nullable(),
    advancedAr: z.boolean(),
    proxyId: z.string().uuid().nullable(),
    defaultStageId: z.string().uuid().nullable(),
    defaultCompositeId: z.string().uuid().nullable(),
    nodetags: z.array(z.string()),
    proxyType: z.string().nullable(),
    effects: z.string().nullable(),
    warnings: z.boolean(),
    fileSize: z.number().nullable(),
    tagids: z.array(z.string()),
    categoryId: z.string().uuid().nullable(),
    head: z.string(),
    customId: z.string().nullable(),
    analytics: z.boolean(),
    attributes: z.any(), // TODO: define this.
    asset: z
      .object({
        assetId: z.string()
      })
      .nullable()
  })
);
export type AssetV2 = z.infer<typeof AssetV2>;

export const AssetV2Listing = Pagination.merge(
  z.object({
    assets: z.array(AssetV2)
  })
);

export type AssetV2Listing = z.infer<typeof AssetV2Listing>;

export const CreateAssetV2Props = AssetV2.pick({
  name: true,
  type: true,
  orgId: true,
  customId: true,
  description: true,
  tags: true,
  keywords: true
}).partial({
  orgId: true,
  customId: true,
  description: true,
  tags: true,
  keywords: true
});

export type CreateAssetV2Props = z.infer<typeof CreateAssetV2Props>;

export const DeleteAssetV2Response = z.object({ message: z.literal('ok') });
export type DeleteAssetV2Response = z.infer<typeof DeleteAssetV2Response>;

const API_ROUTE = `/api/v2/assets`;

export class AssetsV2 extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  healthcheck() {
    return healthcheck(this.context);
  }*/

  create(createProps: CreateAssetV2Props) {
    return create<CreateAssetV2Props, AssetV2>(this.context, {
      orgId: this.context.auth.orgId,
      ...createProps
    });
  }

  getById(id: string) {
    const assetId = z.string().uuid().parse(id);
    return getById<AssetV2>(this.context, assetId);
  }

  deleteById(id: string) {
    const assetId = z.string().uuid().parse(id);
    return deleteById<DeleteAssetV2Response>(this.context, assetId);
  }
}
