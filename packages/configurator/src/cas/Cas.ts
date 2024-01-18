import { z } from 'zod';

export const AssetObject = z.object({
  id: z.string(),
  root: z.string(),
  type: z.string(),
  createdAt: z.string(),
  createdBy: z.string()
});

export const RootObject = z.object({
  heirarchy: z.string().optional(),
  references: z.string(),
  content: z.string()
});

export const PackedConfiguratorObject = z.object({
  attributes: z.array(z.string()),
  rules: z.array(z.string()),
  metadata: z.array(z.string()),
  forms: z.array(z.string()),
  queries: z.array(z.string()).optional()
});

export const AssetContentObject = z.object({
  // id: z.string(),
  name: z.string(),
  type: z.string(),
  plugs: z.string(),
  configurator: z.string().nullable(),
  children: z.array(z.string())
});

export type AssetObject = z.infer<typeof AssetObject>;
export type RootObject = z.infer<typeof RootObject>;
export type PackedConfiguratorObject = z.infer<typeof PackedConfiguratorObject>;
export type AssetContentObject = z.infer<typeof AssetContentObject>;
