import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const DirectionLightProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.directionalLight),
    lightType: z.literal(PROPERTY_TYPE.directionalLight),
    color: z.union([z.number(), ColorValue]),
    autoShadow: z.boolean(),
    intensity: z.number(),
    shadow: z.boolean(),
    shadowBias: z.number(),
    shadowCameraSize: z.number(),
    shadowFarClip: z.number(),
    shadowFrustumColor: z.number(),
    shadowNearClip: z.number(),
    shadowSide: z.string(),
    shadowSize: z.number(),
    showShadowCamera: z.boolean(),
    sourceAngle: z.number()
  })
);

export type DirectionLightProperty = z.infer<typeof DirectionLightProperty>;
