import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const PostEffectProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.postEffect)
  })
);

export type PostEffectProperty = z.infer<typeof PostEffectProperty>;
