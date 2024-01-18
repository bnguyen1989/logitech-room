import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const SpotlightProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.spotLight),
    lightType: z.literal(PROPERTY_TYPE.spotLight),
    color: z.union([z.number(), ColorValue]),
    shadowFrustumColor: z.union([z.number(), ColorValue]),
    intensity: z.number(),
    radius: z.number(),
    distance: z.number(),
    coneAngle: z.number(),
    coneFalloff: z.number(),
    decayExponent: z.number(),
    shadow: z.boolean(),
    shadowSide: z.string(),
    shadowBias: z.number(),
    shadowSize: z.number(),
    shadowNearClip: z.number(),
    shadowFarClip: z.number(),
    autoShadow: z.boolean(),
    showShadowCamera: z.boolean()
  })
);

export type SpotlightProperty = z.infer<typeof SpotlightProperty>;
