import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const SphereProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.sphere),
    radius: z.number(),
    widthSegments: z.number(),
    heightSegments: z.number(),
    phiStart: z.number(),
    phiLength: z.number(),
    thetaStart: z.number(),
    thetaLength: z.number()
  })
);

export type SphereProperty = z.infer<typeof SphereProperty>;
