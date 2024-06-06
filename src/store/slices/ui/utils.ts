import { CardI, FormI, StepDataI } from "./type";
import {
  CameraName,
  MeetingControllerName,
  PlatformName,
  RoomSizeName,
  ServiceName,
  SoftwareServicesName,
} from "../../../utils/permissionUtils";
import { ColorName, FormName, StepName } from "../../../utils/baseUtils";
import { getImageUrl } from "../../../utils/browserUtils";

export enum UI_ACTION_NAME {
  ADD_ACTIVE_CARD = "ui/addActiveCard",
  REMOVE_ACTIVE_CARD = "ui/removeActiveCard",
  CHANGE_ACTIVE_STEP = "ui/changeActiveStep",
  MOVE_TO_START_STEP = "ui/moveToStartStep",
  CLEAR_ALL_ACTIVE_CARDS_STEPS = "ui/clearAllActiveCardsSteps",
}

export enum CUSTOM_UI_ACTION_NAME {
  CHANGE_COUNT_ITEM = "CUSTOM/CHANGE_COUNT_ITEM",
  CHANGE_COLOR_ITEM = "CUSTOM/CHANGE_COLOR_ITEM",
  CREATE_ORDER = "CUSTOM/CREATE_ORDER",
}

export const getFormInitData = (): FormI => {
  return {
    [FormName.QuestionFormSoftware]: {
      isSubmit: false,
    },
  };
};

export const getInitStepData = (): StepDataI => {
  return {
    [StepName.RoomSize]: {
      key: StepName.RoomSize,
      name: "Choose Room Size",
      title: "What size room are you setting up?",
      subtitle:
        "Choose the option that best matches the seating capacity of your room.",
      cards: getRoomCardData(),
    },
    [StepName.Platform]: {
      key: StepName.Platform,
      name: "Choose Platform",
      title: "What is your primary video conferencing platform?",
      subtitle:
        "Choose the video conferencing platform your organization uses most often.",
      cards: {},
    },
    [StepName.Services]: {
      key: StepName.Services,
      name: "Deployment Type",
      title:
        "Do you prefer a video conferencing appliance, or having a dedicated computing device?",
      subtitle: "",
      cards: {},
    },
    [StepName.ConferenceCamera]: {
      key: StepName.ConferenceCamera,
      name: "Conference Camera",
      title: "Choose your conferencing camera(s).",
      subtitle:
        "These recommendations are based on your previous answers. You selected: {2} deployment running {1} in a {0}.",
      cards: {},
    },
    [StepName.AudioExtensions]: {
      key: StepName.AudioExtensions,
      name: "Audio Extensions & Accessories",
      title: "Add room-filling audio.",
      subtitle:
        "Choose from the following audio extensions to make sure everyone can hear and be heard clearly. ",
      cards: {},
    },
    [StepName.MeetingController]: {
      key: StepName.MeetingController,
      name: "Meeting Controller",
      title: "Choose your meeting controller.",
      subtitle:
        "Select tethered or network-connected meeting controller for one-touch join meetings.",
      cards: {},
    },
    [StepName.VideoAccessories]: {
      key: StepName.VideoAccessories,
      name: "Additional Add-Ons",
      title: "Choose your add-ons.",
      subtitle: "Enhance the meeting experience with add-ons.",
      cards: {},
    },
    [StepName.SoftwareServices]: {
      key: StepName.SoftwareServices,
      name: "Software & Services",
      title:
        "Finish up by adding services and tools to ensure your deployment is always up and running.",
      subtitle: "",
      cards: {},
    },
  };
};

export function getPlatformCardData(): Record<string, TypeDataCardI> {
  return {
    [PlatformName.GoogleMeet]: {
      key: StepName.Platform,
      logo: getImageUrl("images/platform/google.jpg"),
      image: getImageUrl("images/platform/google_device.jpg"),
      keyPermission: PlatformName.GoogleMeet,
    },
    [PlatformName.MicrosoftTeams]: {
      key: StepName.Platform,
      logo: getImageUrl("images/platform/microsoft.jpg"),
      image: getImageUrl("images/platform/microsoft_device.jpg"),
      keyPermission: PlatformName.MicrosoftTeams,
    },
    [PlatformName.Zoom]: {
      key: StepName.Platform,
      logo: getImageUrl("images/platform/zoom.jpg"),
      image: getImageUrl("images/platform/zoom_device.jpg"),
      keyPermission: PlatformName.Zoom,
    },
    [PlatformName.BYOD]: {
      key: StepName.Platform,
      image: getImageUrl("images/platform/byod_device.jpg"),
      keyPermission: PlatformName.BYOD,
    },
  };
}

function getRoomCardData(): Record<string, CardI> {
  return {
    [RoomSizeName.Phonebooth]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/phonebooth.png"),
      keyPermission: RoomSizeName.Phonebooth,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Huddle]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/huddle.png"),
      keyPermission: RoomSizeName.Huddle,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Small]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/small.png"),
      keyPermission: RoomSizeName.Small,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Medium]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/medium.png"),
      keyPermission: RoomSizeName.Medium,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Large]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/large.png"),
      keyPermission: RoomSizeName.Large,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Auditorium]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/auditorium.png"),
      keyPermission: RoomSizeName.Auditorium,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
  };
}

type TypeDataCardI = Omit<CardI, "dataThreekit">;
export function getServicesCardData(): Record<string, TypeDataCardI> {
  return {
    [ServiceName.Android]: {
      key: StepName.Services,
      image: getImageUrl("images/services/appliance.png"),
      keyPermission: ServiceName.Android,
    },
    [ServiceName.PC]: {
      key: StepName.Services,
      image: getImageUrl("images/services/pc_baced.png"),
      keyPermission: ServiceName.PC,
    },
  };
}

export function getSoftwareServicesCardData(): Record<string, TypeDataCardI> {
  return {
    [SoftwareServicesName.LogitechSync]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      keyPermission: SoftwareServicesName.LogitechSync,
    },
    [SoftwareServicesName.SupportService]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      keyPermission: SoftwareServicesName.SupportService,
    },
    [SoftwareServicesName.ExtendedWarranty]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      keyPermission: SoftwareServicesName.ExtendedWarranty,
    },
  };
}

export const getExpressionArrayForQuestionForm = () => {
  const expressionArraySelect = [
    [
      { questionIndex: 1, optionIndex: 2 },
      { questionIndex: 2, optionIndex: 2 },
      { questionIndex: 3, optionIndex: 3 },
      { questionIndex: 4, optionIndex: 2 },
    ],
  ];

  const baseExpressionArray = [
    [{ questionIndex: 1, optionIndex: 1 }],
    [{ questionIndex: 2, optionIndex: 1 }],
    [{ questionIndex: 4, optionIndex: 1 }],
  ];
  const expressionArrayBasic = [
    ...baseExpressionArray,
    [{ questionIndex: 3, optionIndex: 1 }],
  ];
  const expressionArrayExtendedWarranty = [
    ...baseExpressionArray,
    [{ questionIndex: 3, optionIndex: 2 }],
  ];

  return {
    select: expressionArraySelect,
    basic: expressionArrayBasic,
    extendedWarranty: expressionArrayExtendedWarranty,
  };
};

export const getColorsData = () => {
  return [
    {
      name: ColorName.Graphite,
      value:
        "https://resource.logitech.com/content/dam/logitech/en/video-collaboration/room-configurator/color-swatch-graphite.svg",
    },
    {
      name: ColorName.White,
      value:
        "https://resource.logitech.com/content/dam/logitech/en/video-collaboration/room-configurator/color-swatch-offwhite.svg",
    },
    {
      name: ColorName.TAA,
      value:
        "https://resource.logitech.com/w_60,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/video-collaboration/room-configurator/color-swatch-taa.png?v=1",
    },
  ];
};

export const getSortedKeyPermissionsByStep = (stepName: StepName) => {
  switch (stepName) {
    case StepName.Services:
      return [ServiceName.Android, ServiceName.PC];
    case StepName.ConferenceCamera:
      return [
        CameraName.RallyBar,
        CameraName.RallyBarMini,
        CameraName.RallyBarHuddle,
        CameraName.MeetUp2,
        CameraName.RallyPlus,
        CameraName.LogitechSight,
      ];
    case StepName.SoftwareServices:
      return [
        SoftwareServicesName.LogitechSync,
        SoftwareServicesName.SupportService,
        SoftwareServicesName.ExtendedWarranty,
      ];
    case StepName.MeetingController:
      return [
        MeetingControllerName.LogitechTap,
        MeetingControllerName.LogitechTapIP,
        MeetingControllerName.TapTableMount,
        MeetingControllerName.TapRiserMount,
        MeetingControllerName.TapWallMount,
      ];
    default:
      return [];
  }
};

export const getDisclaimerCSV = () => {
  return "Configurations are for exploratory purposes only. Room guides and the prices listed are based on local MSRP for the products and are not formal quotes. Prices may vary by location, channel or reseller. Please request a consultation for more information and next steps.";
};
