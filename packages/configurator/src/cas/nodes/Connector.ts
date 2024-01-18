import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { ConnectorProperty } from '../properties/Connector.js';
import { DefaultPropertiesProperty } from '../properties/DefaultProperties.js';
import { TransformProperty } from '../properties/Transform.js';
import { NodeShared } from '../shared.js';

export const ConnectorNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.connector),
    plugs: z.object({
      Connector: z.array(ConnectorProperty),
      Transform: z.array(TransformProperty),
      Properties: z.array(DefaultPropertiesProperty)
    })
  })
);

export type ConnectorNode = z.infer<typeof ConnectorNode>;
