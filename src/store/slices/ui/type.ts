export enum StepName {
  Platform = "Platform",
  RoomSize = "Room Size",
  Services = "Services",
  ConferenceCamera = "Conference Camera",
  AudioExtensions = "Audio Extensions & Accessories",
  MeetingController = "Meeting Controller & Add On",
  VideoAccessories = "Video Accessories",
  SoftwareServices = "Software & Services",
}

export interface StepDataI {
  [StepName.Platform]: StepI;
  [StepName.RoomSize]: StepI;
  [StepName.Services]: StepI;
  [StepName.ConferenceCamera]: StepI;
  [StepName.AudioExtensions]: StepI;
  [StepName.MeetingController]: StepI;
  [StepName.VideoAccessories]: StepI;
  [StepName.SoftwareServices]: StepI;
}

export interface SelectedDataI {
  [key_step: string]: {
    [key_card: string]: {
      selected: Array<string>;
      property: {
        [key: string]: any;
        count?: number;
        color?: string;
      };
    };
  };
}

export interface StepI {
  key: StepName;
  name: string;
  title: string;
  subtitle: string;

  cards: Record<string, CardI>;
}

export interface CardI {
  key: StepName;
  title: string;
  image: string;
  logo?: string;
  subtitle?: string;
  header_title?: string;
  description?: string;
  color?: ColorI;
  counter?: CounterI;
  select?: SelectI;
  keyPermission: string;
  threekit?: ThreekitI;
  recommended?: boolean;
}

export interface ColorItemI {
  name: string;
  value: string;
}
export interface ColorI {
  colors: Array<ColorItemI>;
}

export interface CounterI {
  min: number;
  max: number;
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
  data: Array<SelectDataI>;
}