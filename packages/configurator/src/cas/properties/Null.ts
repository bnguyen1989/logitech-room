import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const NullProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.null)
  })
);

export type NullProperty = z.infer<typeof NullProperty>;
