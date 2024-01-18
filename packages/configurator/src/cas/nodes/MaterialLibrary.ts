import { z } from 'zod';

import { NODE_TYPE } from '../constants.js';
import { NodeShared } from '../shared.js';

export const MaterialLibraryNode = NodeShared.merge(
  z.object({
    type: z.literal(NODE_TYPE.materialLibrary)
    // plugs: z.object()
  })
);

export type MaterialLibraryNode = z.infer<typeof MaterialLibraryNode>;
