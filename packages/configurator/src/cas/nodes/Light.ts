import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { AreaLightProperty } from '../properties/AreaLight.js';
import { DefaultPropertiesProperty } from '../properties/DefaultProperties.js';
import { DirectionLightProperty } from '../properties/DirectionLight.js';
import { HemisphereLightProperty } from '../properties/HemisphereLight.js';
import { PointLightProperty } from '../properties/PointLight.js';
import { SpotlightProperty } from '../properties/Spotlight.js';
import { TransformProperty } from '../properties/Transform.js';
import { NodeShared } from '../shared.js';

export const LightNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.light),
    plugs: z.object({
      Light: z.array(
        z.union([
          AreaLightProperty,
          PointLightProperty,
          DirectionLightProperty,
          HemisphereLightProperty,
          SpotlightProperty
        ])
      ),
      Transform: z.array(TransformProperty),
      Properties: z.array(DefaultPropertiesProperty)
    })
  })
);

export type LightNode = z.infer<typeof LightNode>;
