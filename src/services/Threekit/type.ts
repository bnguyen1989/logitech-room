import {
  CartOrderI,
  DerivativeI,
  MetadataOrderI,
  PlatformOrderI,
} from "../api/Threekit/type";

export interface AssetI {
  id: string;
  name: string;
  type: string;
  orgId: string;
  metadata: MetadataI;
  tags: string[];
  parentFolderId: string;
  advancedAr: boolean;
  proxyId: string;
  publishedAt: string;
  updatedBy: string;
  proxyType: string;
  warnings: boolean;
  fileSize: number;
  tagids: string[];
  head: string;
  analytics: boolean;
  attributes: AttributeApiI[];
}

export interface MetadataI {
  ["Product Name"]: string;
  [key: string]: string;
}

export interface AttributeApiI {
  id: string;
  type: string;
  name: string;
  metadata: MetadataI;
  proxy: ProxyI;
}

export interface ProxyI {
  id: string;
  type: string;
  name: string;
  metadata: MetadataI;
  values: Array<AssetProxyI | string>;
  defaultValue: DefaultValueI | string;
  assetType?: string;
}

export interface AssetProxyI {
  tagId: string;
}

export interface DefaultValueI {
  assetId: string;
}

export interface DataTableRowI {
  id: string;
  value: {
    [key: string]: string;
  };
}

export interface OrdersI {
  page: number;
  perPage: number;
  count: number;
  sort: string;
  orders: OrderI[];
}

export interface OrderI {
  id: string;
  shortId: string;
  orgId: string;
  customerId: string;
  originOrgId: string;
  platform: PlatformOrderI;
  metadata: MetadataOrderI;
  derivative: DerivativeI;
  createdAt: string;
  updatedAt: string;
  status: string;
  name: string;
  cart: CartOrderI[];
}
