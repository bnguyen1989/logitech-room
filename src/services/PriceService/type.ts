export interface DataProductI {
	price?: number;
	strikeThroughPrice?: number;
	inStock?: boolean
}

export interface ProductsDataI {
  [key: string]: ProductI;
}

export interface ProductI {
  brand: string;
  inStock: boolean;
  lowInventory: boolean;
  allowBackorder: boolean;
  buyStatus: string;
  availableQuantity: number;
  notifyMeValue: boolean;
  prices: Prices;
  percentOffFormatted: string;
  hidePrices: boolean;
  sku: string;
  store: string[];
  hideAddToCart: boolean;
  productName: string;
  variantAnalytics: string;
  maximumQuantity: number;
  masterProductId: string;
  storeName: string[];
  addToCartUrlExternal: string[];
}

export interface Prices {
  sale: Sale;
  unit: Unit;
  listPriceWithQuantity: ListPriceWithQuantity;
  list: List;
}

export interface Sale {
  type: string;
  amount: number;
  currency: string;
  amountFormatted: string;
}

export interface Unit {
  type: string;
  amount: number;
  currency: string;
  amountFormatted: string;
}

export interface ListPriceWithQuantity {
  type: string;
  amount: number;
  currency: string;
  amountFormatted: string;
}

export interface List {
  type: string;
  amount: number;
  currency: string;
  amountFormatted: string;
}
