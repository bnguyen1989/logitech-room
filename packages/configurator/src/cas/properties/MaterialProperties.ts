import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const MaterialPropertiesProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.materialProperties),
    prefetch: z.boolean(),
    combineTextures: z.boolean()
  })
);

export type MaterialPropertiesProperty = z.infer<
  typeof MaterialPropertiesProperty
>;
