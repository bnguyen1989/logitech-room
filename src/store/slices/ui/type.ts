
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

export interface StepI<CI> {
	key: StepName;
	name: string;
	title: string;
	subtitle: string;

	activeCards: Array<CI>;
	cards: Array<CI>;
}

export interface BaseCardI {
	title: string;
	image: string;
	keyPermission?: string;
	threekit?: ThreekitI;
	recommended?: boolean;
}

export interface RoomCardI extends BaseCardI{
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
	currentValue: number;
	threekit: Pick<ThreekitI, "key">;
}

export interface ThreekitI {
	assetId: string;
	key: string;
}


export interface SelectDataI {
	label: string;
	value: string;
}
export interface SelectI {
	value: SelectDataI;
	data: Array<SelectDataI>;
}

export interface ItemCardI extends BaseCardI {
	key: StepName.ConferenceCamera | StepName.AudioExtensions | StepName.MeetingController | StepName.VideoAccessories | StepName.SoftwareServices;
	header_title: string;
	subtitle?: string;
	description?: string;
	color?: ColorI;
	counter?: CounterI;
	select?: SelectI;
}