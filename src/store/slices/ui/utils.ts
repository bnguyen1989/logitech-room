import {
  ItemCardI,
  PlatformCardI,
  RoomCardI,
  ServiceCardI,
  StepDataI,
  StepName,
} from "./type";
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

export const getInitStepData = (): StepDataI => {
  return {
    [StepName.RoomSize]: {
      key: StepName.RoomSize,
      name: "Choose Room Size",
      title: "What size room are you setting up?",
      subtitle:
        "Choose the option that best matches the seating capacity of your room.",
      cards: getRoomCardData(),
      activeCards: [],
    },
    [StepName.Platform]: {
      key: StepName.Platform,
      name: "Choose Platform",
      title: "What is your primary video conferencing platform?",
      subtitle:
        "Choose the video conferencing platform your organization uses most often.",
      cards: [],
      activeCards: [],
    },
    [StepName.Services]: {
      key: StepName.Services,
      name: "Lorem Services",
      title:
        "Would you prefer to deploy via a dedicated video conferencing appliance, or a meeting room computer?",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      cards: [],
      activeCards: [],
    },
    [StepName.ConferenceCamera]: {
      key: StepName.ConferenceCamera,
      name: "Conference Camera",
      title: "Choose your conferencing camera(s).",
      subtitle:
        "These recommendations are based on your previous answers. You selected: {2} deployment running {1} in a {0}.",
      cards: [],
      activeCards: [],
    },
    [StepName.AudioExtensions]: {
      key: StepName.AudioExtensions,
      name: "Audio Extensions & Accessories",
      title: "Add room-filling audio.",
      subtitle:
        "Choose from the following audio extensions to make sure everyone can hear and be heard clearly. ",
      cards: [],
      activeCards: [],
    },
    [StepName.MeetingController]: {
      key: StepName.MeetingController,
      name: "Meeting Controller & Add On",
      title: "Choose your meeting controller.",
      subtitle:
        "Select a controller that directly connects to the meeting room PC or video bar, or one that is untethered from the room system.",
      cards: [],
      activeCards: [],
    },
    [StepName.VideoAccessories]: {
      key: StepName.VideoAccessories,
      name: "Video Accessories",
      title: "Pick your video conferencing accessories.",
      subtitle:
        "Add features and flexibility with these video conferencing accessories.",
      cards: [],
      activeCards: [],
    },
    [StepName.SoftwareServices]: {
      key: StepName.SoftwareServices,
      name: "Software & Services",
      title: "Let’s finish up by selecting your software and services.",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      cards: [],
      activeCards: [],
    },
  };
};

export function getPlatformCardData(): Array<PlatformCardI> {
  return [
    {
      key: StepName.Platform,
      logo: LogoGoogle,
      image: DeviceGoogle,
      title: "Google Meet",
      keyPermission: PlatformName.GoogleMeet,
    },
    {
      key: StepName.Platform,
      logo: LogoMS,
      image: DeviceMS,
      title: "Microsoft Teams",
      keyPermission: PlatformName.MicrosoftTeams,
    },
    {
      key: StepName.Platform,
      logo: LogoZoom,
      image: DeviceZoom,
      title: "Zoom",
      keyPermission: PlatformName.Zoom,
    },
  ];
}

function getRoomCardData(): Array<RoomCardI> {
  return [
    {
      key: StepName.RoomSize,
      image: ImagePhonebooth,
      title: "Phone Booth",
      subtitle: "up to 3",
      keyPermission: RoomSizeName.Phonebooth,
    },
    {
      key: StepName.RoomSize,
      image: ImageHundle,
      title: "Huddle Room",
      subtitle: "up to 6",
      keyPermission: RoomSizeName.Huddle,
    },
    {
      key: StepName.RoomSize,
      image: ImageSmall,
      title: "Small Room",
      subtitle: "up to 8",
      keyPermission: RoomSizeName.Small,
    },
    {
      key: StepName.RoomSize,
      image: ImageMedium,
      title: "Medium Room",
      subtitle: "up to 12",
      keyPermission: RoomSizeName.Medium,
    },
    {
      key: StepName.RoomSize,
      image: ImageLarge,
      title: "Large Room",
      subtitle: "up to 20",
      keyPermission: RoomSizeName.Large,
    },
    {
      key: StepName.RoomSize,
      image: ImageAuditorium,
      title: "Alternative",
      subtitle: "more than 20",
      keyPermission: RoomSizeName.Auditorium,
    },
  ];
}

export function getServicesCardData(): Array<ServiceCardI> {
  return [
    {
      key: StepName.Services,
      image: ImageAppliance,
      title: "Appliance-Based",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis sapien fringilla, molestie nisl ut, venenatis elit.",
      keyPermission: ServiceName.Android,
    },
    {
      key: StepName.Services,
      image: ImagePCBased,
      title: "PC-Based",
      subtitle:
        "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris eleifend vitae odio non elementum.",
      keyPermission: ServiceName.PC,
    },
  ];
}

export function getSoftwareServicesCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.SoftwareServices,
      image: ServiceImg,
      header_title: "LOGITECH Basic",
      title: "Device Management Software",
      subtitle: "(Including Sync)",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      keyPermission: SoftwareServicesName.LogitechSync,
    },
    {
      key: StepName.SoftwareServices,
      image: ServiceImg,
      header_title: "LOGITECH SELECT",
      title: "24/7 Enterprise-Grade Support",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      keyPermission: SoftwareServicesName.SupportService,
    },
  ];
}
