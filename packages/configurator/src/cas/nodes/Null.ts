import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { DefaultPropertiesProperty } from '../properties/DefaultProperties.js';
import { NullProperty } from '../properties/Null.js';
import { TransformProperty } from '../properties/Transform.js';
import { NodeShared } from '../shared.js';

export const NullNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.null),
    plugs: z.object({
      Null: z.array(NullProperty),
      Transform: z.array(TransformProperty),
      Properties: z.array(DefaultPropertiesProperty)
    })
  })
);

export type NullNode = z.infer<typeof NullNode>;
