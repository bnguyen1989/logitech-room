import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const MixerProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.mixer)
  })
);

export type MixerProperty = z.infer<typeof MixerProperty>;
