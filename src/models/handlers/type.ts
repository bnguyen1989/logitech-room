export interface AttrSpecI {
	[key: string]: {
		attrType: string;
		allowBlank: boolean;
		validOptionNames: Array<string>;
		validOptionIds: Array<string>;
		defaultValue: string;
		preInvalid: string;
	};
}