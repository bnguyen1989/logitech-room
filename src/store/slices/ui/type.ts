
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
	name: string;
	title: string;
	subtitle: string;

	currentCard?: CI;
	cards: Array<CI>;
}

export interface PlatformCardI {
	key: StepName.Platform;
	logo: string;
	image: string;
	title: string;
}

export interface RoomCardI {
	key: StepName.RoomSize;
	image: string;
	title: string;
	subtitle: string;
}

export interface ServiceCardI {
	key: StepName.Services;
	image: string;
	title: string;
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
}

export interface ItemCardI {
	key: StepName.ConferenceCamera | StepName.AudioExtensions | StepName.MeetingController | StepName.VideoAccessories | StepName.SoftwareServices;
	image: string;
	header_title: string;
	title: string;
	subtitle?: string;
	color?: ColorI;
	counters?: CounterI;
}