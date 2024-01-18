import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ObjectsProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.objects),
    wallPlacement: z.number(),
    allowArScaling: z.boolean()
  })
);

export type ObjectsProperty = z.infer<typeof ObjectsProperty>;
