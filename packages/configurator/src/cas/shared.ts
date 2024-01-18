import { z } from 'zod';

export const PropertyShared = z.object({
  name: z.string(),
  active: z.boolean()
});

export const NodeShared = z.object({
  id: z.string(),
  name: z.string()
  // children: z.array(z.string())
  //   .optional()
});

export const ColorValue = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number()
});

export const Vector3 = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
});
