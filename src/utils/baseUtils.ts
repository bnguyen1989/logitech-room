import { CardPageI } from "../types/textTypePage";

export const getSeparatorItem = () => {
  return " - ";
};

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

export enum DirectionStep {
  Next = "next",
  Prev = "prev",
}

export enum ColorName {
  Graphite = "Graphite",
  White = "White",
  TAA = "TAA",
}

export enum FormName {
  QuestionFormSoftware = "QuestionFormSoftware",
}

export const getPrepareStepNames = () => [
  StepName.RoomSize,
  StepName.Platform,
  StepName.Services,
];

export const getArrayStepNames = () => {
  return [
    StepName.RoomSize,
    StepName.Platform,
    StepName.Services,
    StepName.ConferenceCamera,
    StepName.AudioExtensions,
    StepName.MeetingController,
    StepName.VideoAccessories,
    StepName.SoftwareServices,
  ];
};

export const getFormattingNameColor =
  (colorValue: any) => (langCard: CardPageI) => {
    if (colorValue === ColorName.Graphite) return langCard.Colors.Graphite;
    if (colorValue === ColorName.White) return langCard.Colors.White;
    if (colorValue?.length > 0) return colorValue;
    return "";
  };
