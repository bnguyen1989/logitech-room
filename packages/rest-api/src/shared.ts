import { z } from 'zod';

export const EntityMetadata = z.object({
  createdAt: z.string(),
  createdBy: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
});

export const Pagination = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  //count: z.number(), // what is this?
  sort: z.string().optional()
});
export type Pagination = z.infer<typeof Pagination>;

export const Caching = z.object({
  cacheScope: z.string().optional(),
  cacheMaxAge: z.number().optional()
});
export type Caching = z.infer<typeof Caching>;

export const Metadata = z.record(z.string(), z.union([z.string(), z.number()]));
export type Metadata = z.infer<typeof Metadata>;

export const ConfigurationBase = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object({
    r: z.number(),
    g: z.number(),
    b: z.number()
  })
]);
export type ConfigurationBase = z.infer<typeof ConfigurationBase>;

export const Configuration: z.ZodType<Configuration> = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.object({
      r: z.number(),
      g: z.number(),
      b: z.number()
    }),
    z.lazy(() =>
      z.object({
        assetId: z.union([z.string(), z.literal('')]),
        configuration: z.union([Configuration, z.string()]).optional(),
        type: z.string().optional()
      })
    )
  ])
);
// can not infer from configurationScheme since it is recursive
export type Configuration = {
  [attributeName: string]:
    | z.infer<typeof ConfigurationBase>
    | {
        assetId?: string;
        configuration?: Configuration | string;
      };
};
