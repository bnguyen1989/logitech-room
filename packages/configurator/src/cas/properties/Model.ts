import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ModelProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.model),
    asset: z
      .object({
        assetId: z.string(),
        type: z.string().optional()
      })
      .optional()
  })
);

export type ModelProperty = z.infer<typeof ModelProperty>;
