import { z } from 'zod';

import { ASSET_TYPE, ATTRIBUTE_TYPE } from '../constants.js';
import { ColorValue } from '../shared.js';
import { MetadataArray } from './metadata.js';

/*********************************
 * Attributes
 *********************************/

export const CasAttributeShared = z.object({
  id: z.string().uuid(),
  name: z.string(),
  metadata: z.array(z.union([MetadataArray, z.undefined()])).optional()
});

export const GlobalCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.global),
    defaultValue: z
      .object({
        assetId: z.union([z.string().uuid(), z.literal('')]).nullable()
      })
      .optional()
  })
);

export const PricingCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.pricing),
    name: z.literal('Pricing'),
    blacklist: z.array(z.string()),
    values: z.array(
      z.object({
        pricebook: z.string().uuid(),
        currencies: z.record(z.string(), z.number())
      })
    ),
    defaultValue: z.record(z.string())
  })
);

export const AssetCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.asset),
    assetType: z.nativeEnum(ASSET_TYPE),
    blacklist: z.array(z.string()),
    values: z.array(
      z.union([
        z.string(),
        z.object({ tagId: z.string().uuid() }),
        z.object({ assetId: z.string().uuid() })
      ])
    ),
    defaultValue: z.object({
      assetId: z.union([z.string().uuid(), z.literal('')]),
      type: z.string().optional()
    })
  })
);

export const StringCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.string),
    blacklist: z.array(z.string()),
    values: z.array(z.string()),
    defaultValue: z.string()
  })
);

export const NumberCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.number),
    defaultValue: z.number(),
    min: z.union([z.number(), z.string()]).optional(),
    max: z.union([z.number(), z.string()]).optional(),
    step: z.number(),
    lockToStep: z.boolean()
  })
);

export const BooleanCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.boolean),
    defaultValue: z.boolean()
  })
);

export const ColorCasAttribute = CasAttributeShared.merge(
  z.object({
    type: z.literal(ATTRIBUTE_TYPE.color),
    defaultValue: ColorValue
  })
);

export const CasAttribute = z.union([
  GlobalCasAttribute,
  PricingCasAttribute,
  AssetCasAttribute,
  StringCasAttribute,
  NumberCasAttribute,
  BooleanCasAttribute,
  ColorCasAttribute
]);
// export const Attribute = z.union(attributes);

export type GlobalCasAttribute = z.infer<typeof GlobalCasAttribute>;
export type PricingCasAttribute = z.infer<typeof PricingCasAttribute>;
export type AssetCasAttribute = z.infer<typeof AssetCasAttribute>;
export type StringCasAttribute = z.infer<typeof StringCasAttribute>;
export type NumberCasAttribute = z.infer<typeof NumberCasAttribute>;
export type BooleanCasAttribute = z.infer<typeof BooleanCasAttribute>;
export type ColorCasAttribute = z.infer<typeof ColorCasAttribute>;

export type CasAttribute = z.infer<typeof CasAttribute>;
