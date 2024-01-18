import { z } from 'zod';

export const MetadataConfiguratorArray = z.object({
  blacklist: z.array(z.string()),
  defaultValue: z.union([z.string(), z.number()]),
  id: z.string().uuid(),
  metadata: z.array(z.void()),
  name: z.string(),
  type: z.union([z.literal('Number'), z.literal('String')]),
  values: z.array(z.void())
});

export const MetadataArray = z.object({
  key: z.string(),
  type: z.union([z.literal('string'), z.literal('number')]),
  value: z.union([z.string(), z.number()])
});

export const Metadata = z.record(z.string(), z.union([z.string(), z.number()]));

export type MetadataConfiguratorArray = z.infer<
  typeof MetadataConfiguratorArray
>;
export type Metadata = z.infer<typeof Metadata>;
