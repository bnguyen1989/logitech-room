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

export type PropertyDependentElement = Record<
  string,
  {
    active: boolean;
    property?: Record<string, any>;
  }
>;
