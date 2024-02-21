import { AssetI, DefaultValueI, MetadataI } from "../../services/Threekit/type";

export type ThreekitDataT = {
  [key: NamePropertiesConfiguratorType]: AttributeI;
};

export type NamePropertiesConfiguratorType = string;

export type ConfiguratorDataValueType = string | AssetI;

export interface AttributeI {
  id: string;
  type: string;
  name: string;
  metadata: MetadataI;
  values: Array<AssetI | string>;
  defaultValue: DefaultValueI | string;
  assetType?: string;
}

export interface ConfigurationI {
  [key: string]: string | DefaultValueI;
}
