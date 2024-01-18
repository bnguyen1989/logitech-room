import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { ObjectsProperty } from '../properties/Objects.js';
import { PropertyShared } from '../shared.js';

export const ObjectsNode = PropertyShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.objects),
    plugs: z.object({
      Objects: z.array(ObjectsProperty)
    })
  })
);

export type ObjectsNode = z.infer<typeof ObjectsNode>;
