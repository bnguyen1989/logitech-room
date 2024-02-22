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

export interface AttributesStateI {
  [key: string]: AttributeStateI;
}

export interface AttributeStateI {
  disabledValues: Array<ValueStringStateI | ValueAssetStateI>;
  enabled: boolean;
  hiddenValues: Array<ValueStringStateI | ValueAssetStateI>;
  visible: boolean;
  values: Array<ValueStringStateI | ValueAssetStateI>;
}

export interface ValueStringStateI {
  value: string;
  enabled: boolean;
  visible: boolean;
}
export interface ValueAssetStateI extends AssetI{
  enabled: boolean;
  visible: boolean;
}
