import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { EnvironmentOverrideProperty } from '../properties/EnvironmentOverride.js';
import { MaterialProperty } from '../properties/Material.js';
import { MaterialPropertiesProperty } from '../properties/MaterialProperties.js';
import { TilingOverrideProperty } from '../properties/TilingOverride.js';
import { NodeShared } from '../shared.js';

export const MaterialNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.material),
    plugs: z.object({
      Material: z.array(
        z.union([
          MaterialProperty,
          EnvironmentOverrideProperty,
          TilingOverrideProperty
        ])
      ),
      Properties: z.array(MaterialPropertiesProperty)
    })
  })
);

export type MaterialNode = z.infer<typeof MaterialNode>;
