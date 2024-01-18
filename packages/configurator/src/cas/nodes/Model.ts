import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { MixerProperty } from '../properties/Mixer.js';
import { ModelProperty } from '../properties/Model.js';
import { ModelPropertiesProperty } from '../properties/ModelProperties.js';
import { TransformProperty } from '../properties/Transform.js';
import { NodeShared } from '../shared.js';

export const ModelNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.model),
    plugs: z.object({
      Null: z.array(ModelProperty),
      Transform: z.array(TransformProperty),
      Properties: z.array(ModelPropertiesProperty),
      Mixer: z.array(MixerProperty)
    })
  })
);

export type ModelNode = z.infer<typeof ModelNode>;
