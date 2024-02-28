export interface DataCreateOrderI {
	customerId: string,
	originOrgId: string,
	platform: PlatformOrderI,
	cart: Array<CartOrderI>,
	metadata?: MetadataOrderI,
	derivative?: DerivativeI,
}

export interface PlatformOrderI {
	id: string,
	platform: string,
	storeName: string,
}

export interface CartOrderI {
	metadata: MetadataOrderI,
	configurationId: string
	count: number
}

export interface MetadataOrderI {
	[key: string]: string
}

export interface DerivativeI extends MetadataOrderI {}

export interface DataGetOrdersI {
	shortId?: string,
	originOrgId?: string,
}