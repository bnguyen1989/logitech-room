import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const BoxProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.box),
    depth: z.number(),
    depthSegments: z.number(),
    width: z.number(),
    widthSegments: z.number(),
    height: z.number(),
    heightSegments: z.number()
  })
);

export type BoxProperty = z.infer<typeof BoxProperty>;
