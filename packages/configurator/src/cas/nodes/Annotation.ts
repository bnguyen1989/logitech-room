import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { AnnotationProperty } from '../properties/Annotation.js';
import { DefaultPropertiesProperty } from '../properties/DefaultProperties.js';
import { TransformProperty } from '../properties/Transform.js';
import { NodeShared } from '../shared.js';

export const AnnotationNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.annotation),
    plugs: z.object({
      Annotation: z.array(AnnotationProperty),
      Transform: z.array(TransformProperty),
      Properties: z.array(DefaultPropertiesProperty)
    })
  })
);

export type AnnotationNode = z.infer<typeof AnnotationNode>;
