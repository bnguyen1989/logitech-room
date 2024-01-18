import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const PointLightProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.pointLight),
    lightType: z.literal(PROPERTY_TYPE.pointLight),
    color: z.union([z.number(), ColorValue]),
    decayExponent: z.number(),
    distance: z.number(),
    intensity: z.number(),
    radius: z.number(),
    shadow: z.boolean(),
    shadowBias: z.number(),
    shadowFarClip: z.number(),
    shadowNearClip: z.number(),
    shadowSide: z.string(),
    shadowSize: z.number()
  })
);

export type PointLightProperty = z.infer<typeof PointLightProperty>;
