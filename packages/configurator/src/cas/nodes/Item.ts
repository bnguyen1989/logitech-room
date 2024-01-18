import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { ProxyProperty } from '../properties/Proxy.js';
import { NodeShared } from '../shared.js';

export const ItemNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.item),
    plugs: z.object({
      Proxy: z.array(ProxyProperty)
    })
  })
);

export type ItemNode = z.infer<typeof ItemNode>;
