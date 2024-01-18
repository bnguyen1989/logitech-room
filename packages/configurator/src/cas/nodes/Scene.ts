import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { EnvironmentProperty } from '../properties/Environment.js';
import { PostEffectProperty } from '../properties/PostEffect.js';
import { PropertyShared } from '../shared.js';

export const SceneNode = PropertyShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.scene),
    plugs: z.object({
      Environment: z.array(EnvironmentProperty),
      PostEffect: z.array(PostEffectProperty)
      // RenderSettings: z.array().required().empty(z.array().length(0))
    })
  })
);

export type SceneNode = z.infer<typeof SceneNode>;
