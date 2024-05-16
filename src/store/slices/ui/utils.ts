import { CardI, QuestionFormI, StepDataI } from "./type";
import {
  CameraName,
  MeetingControllerName,
  PlatformName,
  RoomSizeName,
  ServiceName,
  SoftwareServicesName,
} from "../../../utils/permissionUtils";
import { ColorName, StepName } from "../../../utils/baseUtils";
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
      subtitle:
        "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ",
      keyPermission: PlatformName.BYOD,
    },
  };
}

function getRoomCardData(): Record<string, CardI> {
  return {
    [RoomSizeName.Phonebooth]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/phonebooth.png"),
      subtitle: "up to 3",
      keyPermission: RoomSizeName.Phonebooth,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Huddle]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/huddle.png"),
      subtitle: "up to 6",
      keyPermission: RoomSizeName.Huddle,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Small]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/small.png"),
      subtitle: "up to 8",
      keyPermission: RoomSizeName.Small,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Medium]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/medium.png"),
      subtitle: "up to 12",
      keyPermission: RoomSizeName.Medium,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Large]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/large.png"),
      subtitle: "up to 20",
      keyPermission: RoomSizeName.Large,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Auditorium]: {
      key: StepName.RoomSize,
      image: getImageUrl("images/rooms/auditorium.png"),
      subtitle: "more than 20",
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
      subtitle:
        "A pre-configured video conferencing system with built-in computing capabilities, no external PC required.",
      keyPermission: ServiceName.Android,
    },
    [ServiceName.PC]: {
      key: StepName.Services,
      image: getImageUrl("images/services/pc_baced.png"),
      subtitle:
        "Plug and play with any PC, Mac, or Chromebox via USB to complete your room solution.",
      keyPermission: ServiceName.PC,
    },
  };
}

export function getSoftwareServicesCardData(): Record<string, TypeDataCardI> {
  return {
    [SoftwareServicesName.LogitechSync]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      description:
        "Always included with your hardware purchase. Global, business-hours support and 2-year standard warranty, as well as software to better manage and maintain your deployment.",
      keyPermission: SoftwareServicesName.LogitechSync,
    },
    [SoftwareServicesName.SupportService]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      description:
        "Comprehensive 24/7 support, advanced product replacements, and proactive software and insights to ensure business continuity.",
      keyPermission: SoftwareServicesName.SupportService,
    },
    [SoftwareServicesName.ExtendedWarranty]: {
      key: StepName.SoftwareServices,
      image: getImageUrl("images/items/service.jpg"),
      description:
        "Add up to 3 years of warranty to extend coverage and support for your devices.",
      keyPermission: SoftwareServicesName.ExtendedWarranty,
    },
  };
}

export const getTitleFromDataByKeyPermission = (keyPermission: string) => {
  switch (keyPermission) {
    case RoomSizeName.Phonebooth:
      return "Phone Booth";
    case RoomSizeName.Huddle:
      return "Huddle Room";
    case RoomSizeName.Small:
      return "Small Room";
    case RoomSizeName.Medium:
      return "Medium Room";
    case RoomSizeName.Large:
      return "Large Room";
    case RoomSizeName.Auditorium:
      return "Auditorium";
    case PlatformName.GoogleMeet:
      return "Google Meet";
    case PlatformName.MicrosoftTeams:
      return "Microsoft Teams";
    case PlatformName.Zoom:
      return "Zoom";
    case PlatformName.BYOD:
      return "Choose a Bring-Your-Own-Device setup";
    case ServiceName.Android:
      return "Appliance-Based";
    case ServiceName.PC:
      return "PC-Based";
    case SoftwareServicesName.SupportService:
      return "Select Service Plan";
    default:
      return "";
  }
};

export const getDescriptionRoomBySize = (size: string) => {
  switch (size) {
    case RoomSizeName.Phonebooth:
      return "Phone booths work great for ad-hoc video meetings when you need a quiet environment without disturbing others.";
    case RoomSizeName.Huddle:
      return "Huddle rooms are great for hybrid meetings with remote participants.";
    case RoomSizeName.Small:
      return "Small meeting rooms are great for hybrid meetings when you have a few more people in the room with you.";
    case RoomSizeName.Medium:
      return "These traditionally-sized rooms typically need additional add-ons or smarter capabilities to better capture the in-room action.";
    case RoomSizeName.Large:
      return "Large, traditionally shaped rooms typically require additional products to extend coverage and ensure everyone can be seen and heard clearly.";
    case RoomSizeName.Auditorium:
      return "Large, traditionally shaped rooms typically require additional products to extend coverage and ensure everyone can be seen and heard clearly.";
    default:
      return "";
  }
};

export const getDataQuestionFormPartner = (): Array<QuestionFormI> => {
  return [
    {
      question: "What are the expected hours of support?",
      options: [
        { value: false, text: "Business Hours" },
        { value: false, text: "24/7" },
      ],
      active: true,
      done: false,
    },
    {
      question: "What’s the expected repair time for meeting rooms?",
      options: [
        { value: false, text: "Within 1 week" },
        { value: false, text: "Within 1 hour" },
      ],
      active: false,
      done: false,
    },
    {
      question: "What’s the typical life cycle for meeting room hardware?",
      options: [
        { value: false, text: "Less than 2 years" },
        { value: false, text: "2-5 years" },
        { value: false, text: "5 years or more" },
      ],
      active: false,
      done: false,
    },
    {
      question:
        "What support service is needed to ensure meeting rooms are always up and running?",
      options: [
        { value: false, text: "Tech support when needed" },
        { value: false, text: "Dedicated, additional service and support" },
      ],
      active: false,
      done: false,
    },
  ];
};

export const getDataQuestionFormCustomer = (): Array<QuestionFormI> => {
  return [
    {
      question: " What are your hours of support?",
      options: [
        { value: false, text: "Business Hours" },
        { value: false, text: "24/7" },
      ],
      active: true,
      done: false,
    },
    {
      question: "What’s your repair time for meeting rooms?",
      options: [
        { value: false, text: "Within 1 week" },
        { value: false, text: "Within 1 hour" },
      ],
      active: false,
      done: false,
    },
    {
      question: "What’s the typical lifecycle for meeting room hardware?",
      options: [
        { value: false, text: "Less than 2 years" },
        { value: false, text: "2-5 years" },
        { value: false, text: "5 years or more" },
      ],
      active: false,
      done: false,
    },
    {
      question:
        "What support service is needed for you to ensure your meeting rooms are always up and running?",
      options: [
        { value: false, text: "Tech support when I need it" },
        { value: false, text: "Dedicated, additional service and support" },
      ],
      active: false,
      done: false,
    },
  ];
};

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
      MeetingControllerName.TapTableMount,
      MeetingControllerName.TapRiserMount,
      MeetingControllerName.TapWallMount,
    ]
    default:
      return [];
  }
};

export const getDisclaimerCSV = () => {
  return "Configurations are for exploratory purposes only. Room guides and the prices listed are based on local MSRP for the products and are not formal quotes. Prices may vary by location, channel or reseller. Please request a consultation for more information and next steps.";
};
