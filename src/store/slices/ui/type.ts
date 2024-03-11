import { ValueAssetStateI } from "../../../models/configurator/type";

export enum StepName {
	Platform = 'Platform',
	RoomSize = 'Room Size',
	Services = 'Services',
	ConferenceCamera = 'Conference Camera',
	AudioExtensions = 'Audio Extensions & Accessories',
	MeetingController = 'Meeting Controller & Add On',
	VideoAccessories = 'Video Accessories',
	SoftwareServices = 'Software & Services',
}

export type StepCardType = PlatformCardI | RoomCardI | ServiceCardI | ItemCardI;

export interface StepDataI {
	[StepName.Platform]: StepI<PlatformCardI>;
	[StepName.RoomSize]: StepI<RoomCardI>;
	[StepName.Services]: StepI<ServiceCardI>;
	[StepName.ConferenceCamera]: StepI<ItemCardI>;
	[StepName.AudioExtensions]: StepI<ItemCardI>;
	[StepName.MeetingController]: StepI<ItemCardI>;
	[StepName.VideoAccessories]: StepI<ItemCardI>;
	[StepName.SoftwareServices]: StepI<ItemCardI>;
}

export interface SelectedDataI {
	[key_step: string]: {
		[key_card: string]: {
			selected: Array<string>;
			property: {
				[key: string]: any;
				count?: number;
				color?: string;
			}
		};
	}
}

export interface StepI<CI> {
	key: StepName;
	name: string;
	title: string;
	subtitle: string;

	activeCards: Array<CI>;
	cards: Array<CI>;
}

export interface BaseCardI { 
	image: string;
	keyPermission?: string;
	recommended?: boolean;
	threekitItems: Record<string, ValueAssetStateI>
}

export interface RoomCardI extends BaseCardI {
	key: StepName.RoomSize;
	subtitle: string;
}

export interface PlatformCardI extends BaseCardI {
	key: StepName.Platform;
	logo: string;
}

export interface ServiceCardI extends BaseCardI {
	key: StepName.Services;
	subtitle: string;
}

export interface ColorItemI {
	name: string;
	value: string;
}
export interface ColorI {
	currentColor: ColorItemI;
	colors: Array<ColorItemI>;
}

export interface CounterI {
	min: number;
	max: number; 
	// threekit: Pick<ThreekitI, "key">; ???????
}

export interface ThreekitI {
	assetId: string;
	key: string;
}


export interface SelectDataI {
	label: string;
	value: string;
	threekit: Pick<ThreekitI, "assetId">;
}
export interface SelectI {
	value: SelectDataI;
	data: Array<SelectDataI>;
}

export interface ItemCardI extends BaseCardI {
	key: StepName.ConferenceCamera | StepName.AudioExtensions | StepName.MeetingController | StepName.VideoAccessories | StepName.SoftwareServices;
	subtitle?: string;
	description?: string;
	counter?: CounterI;
	select?: SelectI;
}



export type TypeCardPermissionWithDataThreekit = Record<string, Record<string, ValueAssetStateI>>;