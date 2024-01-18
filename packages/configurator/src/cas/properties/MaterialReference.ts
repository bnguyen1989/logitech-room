import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const MaterialReferenceProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.reference),
    assetDepr: z.string(),
    defaultColor: z.union([z.number(), ColorValue]),
    reference: z.object({
      assetId: z.string(),
      type: z.string()
    }),
    asset: z.object({ assetId: z.string() })
  })
);

export type MaterialReferenceProperty = z.infer<
  typeof MaterialReferenceProperty
>;
