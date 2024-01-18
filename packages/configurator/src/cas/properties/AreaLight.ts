import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const AreaLightProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.areaLight),
    lightType: z.literal(PROPERTY_TYPE.areaLight),
    color: z.union([z.number(), ColorValue]),
    intensity: z.number(),
    width: z.number(),
    height: z.number(),
    shadow: z.boolean(),
    shadowSide: z.string(),
    shadowBias: z.number()
  })
);

export type AreaLightProperty = z.infer<typeof AreaLightProperty>;
