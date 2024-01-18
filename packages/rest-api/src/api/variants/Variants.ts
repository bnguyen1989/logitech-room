import { z } from 'zod';

import { getById } from '../../operators/getById.js';
import { updateById } from '../../operators/updateById.js';
import {
  Caching,
  Configuration,
  EntityMetadata,
  Pagination
} from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const Variant = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    assetId: z.string().uuid(),
    orgId: z.string().uuid(),
    jobId: z.string().uuid(),
    taskId: z.string().uuid(),
    variantId: z.string(),
    sharedDataId: z.string(),
    metadata: z.nullable(
      z.record(z.string(), z.union([z.string(), z.number()]))
    ),
    variant: Configuration,
    updatedAt: z.string(),
    updatedBy: z.string()
  })
);
export type Variant = z.infer<typeof Variant>;

export const VariantSharedData = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    assetId: z.string().uuid(),
    orgId: z.string().uuid(),
    jobId: z.string().uuid(),
    taskId: z.string().uuid(),
    ready: z.boolean(),
    visualAttributes: z.string(),
    variantAttributes: z.record(
      z.string(),
      z.union([z.string().array(), z.object({ assetId: z.string() }).array()])
    )
  })
);
export type VariantSharedData = z.infer<typeof VariantSharedData>;

export const VariantListing = Pagination.merge(
  z.object({
    variants: Variant.array(),
    shared_data: VariantSharedData
  })
);
export type VariantListing = z.infer<typeof VariantListing>;

export const UpdateVariantProps = Variant.pick({
  variantId: true,
  metadata: true
}).partial();
export type UpdateVariantProps = z.infer<typeof UpdateVariantProps>;

const API_ROUTE = `api/variants`;

export class Variants extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  BEN: This route does not exist on the /variants REST API endpoint as of Dec 6, 2023
  healthcheck() {
    return healthcheck(this.context);
  }*/

  getById(id: string, caching: Caching = {}) {
    const variantId = z.string().uuid().parse(id);

    return getById<Variant>(this.context, variantId, caching);
  }

  updateById(id: string, updateProps: UpdateVariantProps) {
    const variantId = z.string().uuid().parse(id);
    return updateById<UpdateVariantProps, object>(
      this.context,
      variantId,
      updateProps
    );
  }
}
