import { Asset } from '@threekit/rest-api';
import { z } from 'zod';

import {
  AssetCasAttribute,
  BooleanCasAttribute,
  CasAttributeShared,
  ColorCasAttribute,
  NumberCasAttribute,
  StringCasAttribute
} from '../cas/configurator/attributes.js';
import { UnpackedConfigurator } from '../cas/configurator/index.js';
import { Metadata } from '../cas/configurator/metadata.js';

/*********************************
 * Attribute Options and Configuration Values
 *********************************/

const StringOption = z.object({
  label: z.string(),
  value: z.string(),
  visible: z.boolean(),
  enabled: z.boolean()
});

const StringValue = z.string();

const BooleanValue = z.boolean();

const NumberValue = z.number();

const ColorValue = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number()
});

const AssetOption = Asset.pick({
  name: true,
  tags: true,
  tagids: true,
  fileSize: true
}).merge(
  z.object({
    assetId: z.string().uuid(),
    metadata: Metadata,
    visible: z.boolean(),
    enabled: z.boolean()
  })
);

const HydratedConfiguration = z.record(
  z.string(),
  z.union([StringValue, NumberValue, BooleanValue, ColorValue, AssetOption])
);

export type HydratedConfiguration = z.infer<typeof HydratedConfiguration>;

/*********************************
 * Attributes
 *********************************/

const AttributeShared = CasAttributeShared.merge(
  z.object({
    visible: z.boolean(),
    enabled: z.boolean(),
    metadata: Metadata
  })
);

export const AssetAttribute = AssetCasAttribute.pick({
  type: true,
  assetType: true,
  defaultValue: true
})
  .merge(AttributeShared)
  .merge(z.object({ values: z.array(AssetOption) }));

export const StringAttribute = StringCasAttribute.pick({
  type: true,
  defaultValue: true
})
  .merge(AttributeShared)
  .merge(z.object({ values: z.array(StringOption) }));

export const NumberAttribute = NumberCasAttribute.pick({
  type: true,
  defaultValue: true,
  step: true,
  lockToStep: true
})
  .merge(AttributeShared)
  .merge(
    z.object({
      min: z.number().optional(),
      max: z.number().optional()
    })
  );

export const BooleanAttribute = BooleanCasAttribute.pick({
  type: true,
  defaultValue: true
}).merge(AttributeShared);

export const ColorAttribute = ColorCasAttribute.pick({
  type: true,
  defaultValue: true
}).merge(AttributeShared);

export const Attribute = z.union([
  AssetAttribute,
  StringAttribute,
  NumberAttribute,
  BooleanAttribute,
  ColorAttribute
]);

export type AssetAttribute = z.infer<typeof AssetAttribute>;
export type StringAttribute = z.infer<typeof StringAttribute>;
export type NumberAttribute = z.infer<typeof NumberAttribute>;
export type BooleanAttribute = z.infer<typeof BooleanAttribute>;
export type ColorAttribute = z.infer<typeof ColorAttribute>;

export type Attribute = z.infer<typeof Attribute>;

export const Configurator = UnpackedConfigurator.pick({
  metadata: true,
  rules: true
}).merge(
  z.object({
    name: z.string(),
    attributes: z.array(Attribute)
  })
);

export type Configurator = z.infer<typeof Configurator>;
