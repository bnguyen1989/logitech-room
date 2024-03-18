import { CardI, StepDataI, StepName } from "./type";
import LogoMS from "../../../assets/images/platform/microsoft.jpg";
import LogoGoogle from "../../../assets/images/platform/google.jpg";
import LogoZoom from "../../../assets/images/platform/zoom.jpg";
import DeviceMS from "../../../assets/images/platform/microsoft_device.jpg";
import DeviceGoogle from "../../../assets/images/platform/google_device.jpg";
import DeviceZoom from "../../../assets/images/platform/zoom_device.jpg";
import ImagePhonebooth from "../../../assets/images/rooms/phonebooth.png";
import ImageHundle from "../../../assets/images/rooms/huddle.png";
import ImageSmall from "../../../assets/images/rooms/small.png";
import ImageMedium from "../../../assets/images/rooms/medium.png";
import ImageLarge from "../../../assets/images/rooms/large.png";
import ImageAuditorium from "../../../assets/images/rooms/auditorium.png";
import ImageAppliance from "../../../assets/images/services/appliance.png";
import ImagePCBased from "../../../assets/images/services/pc_baced.png";
import ServiceImg from "../../../assets/images/items/service.jpg";
import {
  PlatformName,
  RoomSizeName,
  ServiceName,
  SoftwareServicesName,
} from "../../../utils/permissionUtils";

export enum UI_ACTION_NAME {
  ADD_ACTIVE_CARD = "ui/addActiveCard",
  REMOVE_ACTIVE_CARD = "ui/removeActiveCard",
  CHANGE_ACTIVE_STEP = "ui/changeActiveStep",
}

export enum CUSTOM_UI_ACTION_NAME {
  CHANGE_COUNT_ITEM = "CUSTOM/CHANGE_COUNT_ITEM",
  CHANGE_COLOR_ITEM = "CUSTOM/CHANGE_COLOR_ITEM",
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
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
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
      logo: LogoGoogle,
      image: DeviceGoogle,
      // title: "Google Meet",
      keyPermission: PlatformName.GoogleMeet,
    },
    [PlatformName.MicrosoftTeams]: {
      key: StepName.Platform,
      logo: LogoMS,
      image: DeviceMS,
      // title: "Microsoft Teams",
      keyPermission: PlatformName.MicrosoftTeams,
    },
    [PlatformName.Zoom]: {
      key: StepName.Platform,
      logo: LogoZoom,
      image: DeviceZoom,
      // title: "Zoom",
      keyPermission: PlatformName.Zoom,
    },
  };
}

function getRoomCardData(): Record<string, CardI> {
  return {
    [RoomSizeName.Phonebooth]: {
      key: StepName.RoomSize,
      image: ImagePhonebooth,
      // title: "Phone Booth",
      subtitle: "up to 3",
      keyPermission: RoomSizeName.Phonebooth,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Huddle]: {
      key: StepName.RoomSize,
      image: ImageHundle,
      // title: "Huddle Room",
      subtitle: "up to 6",
      keyPermission: RoomSizeName.Huddle,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Small]: {
      key: StepName.RoomSize,
      image: ImageSmall,
      // title: "Small Room",
      subtitle: "up to 8",
      keyPermission: RoomSizeName.Small,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Medium]: {
      key: StepName.RoomSize,
      image: ImageMedium,
      // title: "Medium Room",
      subtitle: "up to 12",
      keyPermission: RoomSizeName.Medium,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Large]: {
      key: StepName.RoomSize,
      image: ImageLarge,
      // title: "Large Room",
      subtitle: "up to 20",
      keyPermission: RoomSizeName.Large,
      dataThreekit: {
        attributeName: "",
        threekitItems: {},
      },
    },
    [RoomSizeName.Auditorium]: {
      key: StepName.RoomSize,
      image: ImageAuditorium,
      // title: "Alternative",
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
      image: ImageAppliance,
      // title: "Appliance-Based",
      subtitle:
        "A pre-configured video conferencing system with built-in computing capabilities, no external PC required.",
      keyPermission: ServiceName.Android,
    },
    [ServiceName.PC]: {
      key: StepName.Services,
      image: ImagePCBased,
      // title: "PC-Based",
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
      image: ServiceImg,
      // header_title: "LOGITECH Basic",
      // title: "Device Management Software",
      subtitle: "(Including Sync)",
      description:
        "Global, business-hours support and 2 year standard warranty, as well as software to better manage and maintain your deployment.",
      keyPermission: SoftwareServicesName.LogitechSync,
    },
    [SoftwareServicesName.SupportService]: {
      key: StepName.SoftwareServices,
      image: ServiceImg,
      // header_title: "LOGITECH SELECT",
      // title: "24/7 Enterprise-Grade Support",
      description:
        "Comprehensive 24/7 support, advanced product replacements, and proactive software and insights to ensure business continuity.",
      keyPermission: SoftwareServicesName.SupportService,
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
    case ServiceName.Android:
      return "Appliance-Based";
    case ServiceName.PC:
      return "PC-Based";
    case SoftwareServicesName.LogitechSync:
      return "Device Management Software";
    case SoftwareServicesName.SupportService:
      return "24/7 Enterprise-Grade Support";
    default:
      return "";
  }
}
