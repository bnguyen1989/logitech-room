import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const EnvironmentOverrideProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.environmentOverride),
    environmentMapFactor: z.number(),
    environmentMapFlip: z.boolean(),
    environmentMapRotation: z.number(),
    environmentMap: z.object({
      assetId: z.string(),
      type: z.string().optional()
    })
  })
);

export type EnvironmentOverrideProperty = z.infer<
  typeof EnvironmentOverrideProperty
>;
