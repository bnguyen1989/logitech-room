import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { ColorValue, PropertyShared } from '../shared.js';

export const EnvironmentProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.environment),
    ambientLight: z.number(),
    ambientLightFactor: z.number(),
    environmentMapRotation: z.number(),
    environmentMapFlip: z.number(),
    environmentMapFactor: z.number(),
    backgroundStyle: z.number(),
    backgroundColor: z.union([z.number(), ColorValue]),
    backgroundColorOpacity: z.number(),
    backgroundImagePosition: z.number(),
    backgroundCubeMapRotation: z.number(),
    backgroundCubeMapFlip: z.number()
  })
);

export type EnvironmentProperty = z.infer<typeof EnvironmentProperty>;
