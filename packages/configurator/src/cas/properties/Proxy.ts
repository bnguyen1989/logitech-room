import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ProxyProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.proxy),
    asset: z
      .object({
        assetId: z.string().uuid().nullable(),
        type: z.string().optional(),
        name: z.string().optional()
      })
      .optional()
  })
);

export type ProxyProperty = z.infer<typeof ProxyProperty>;
