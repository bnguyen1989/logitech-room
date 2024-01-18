import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const HemisphereLightProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.hemisphereLight),
    lightType: z.literal(PROPERTY_TYPE.hemisphereLight),
    color: z.union([z.number(), ColorValue]),
    gndColor: z.union([z.number(), ColorValue]),
    intensity: z.number()
  })
);

export type HemisphereLightProperty = z.infer<typeof HemisphereLightProperty>;
