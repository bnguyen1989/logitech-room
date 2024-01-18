import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const AnnotationProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.annotation),
    useText: z.boolean(),
    text: z.string(),
    width: z.number(),
    defaultOpen: z.boolean(),
    limitVisibility: z.boolean(),
    visibilityAngle: z.number(),
    directionMode: z.string(),
    directionAxis: z.string()
  })
);

export type AnnotationProperty = z.infer<typeof AnnotationProperty>;
