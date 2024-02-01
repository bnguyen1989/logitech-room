export type ThreekitDataT = {
	[key: NamePropertiesConfiguratorType]: ThreekitDataValueType
};

export type ThreekitDataValueType = {
	defaultValue: ConfiguratorDataValueType
	name: string
	type: string
	values: Array<ConfiguratorDataValueType>
	currentValue?: ConfiguratorDataValueType
};

export type NamePropertiesConfiguratorType = string;


export type ConfiguratorDataValueType = string | AssetI;

export interface AssetI {
  id: string
  name: string
  type: string
  orgId: string
  metadata: MetadataI
  tags: string[]
  parentFolderId: string
  advancedAr: boolean
  proxyId: string
  publishedAt: string
  updatedBy: string
  proxyType: string
  warnings: boolean
  fileSize: number
  tagids: string[]
  head: string
  analytics: boolean
  attributes: AttributeI[]
}

export interface MetadataI {
  [key: string]: string
}

export interface AttributeI {
  id: string
  type: string
  name: string
  metadata: MetadataI
  proxy: ProxyI
}

export interface ProxyI {
  id: string
  type: string
  name: string
  metadata: MetadataI
  values: Array<AssetProxyI | string>;
  defaultValue: AssetProxyI | string;
  assetType?: string
}

export interface AssetProxyI {
  assetId?: string
	tagId?: string
}
