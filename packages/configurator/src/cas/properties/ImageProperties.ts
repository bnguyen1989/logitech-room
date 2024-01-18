import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const ImagePropertiesProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.imageProperties),
    prefetch: z.boolean()
  })
);

export type ImagePropertiesProperty = z.infer<typeof ImagePropertiesProperty>;
