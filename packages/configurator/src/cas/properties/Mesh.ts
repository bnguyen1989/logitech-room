import { z } from 'zod';

import { PROPERTY_TYPE } from '../constants.js';
import { PropertyShared } from '../shared.js';

export const MeshProperty = PropertyShared.merge(
  z.object({
    type: z.literal(PROPERTY_TYPE.mesh),
    geometry: z
      .object({
        filename: z.string(),
        hash: z.string(),
        type: z.string()
      })
      .optional(),
    gl_optimizer: z.string(),
    gl_simpFaceCount: z.number(),
    arNotWebGL: z.boolean(),
    and_optimizer: z.string(),
    and_simpFaceCount: z.number(),
    ios_optimizer: z.string(),
    ios_simpFaceCount: z.number(),
    compressionOn: z.boolean(),
    compressor: z.string()
  })
);

export type MeshProperty = z.infer<typeof MeshProperty>;
