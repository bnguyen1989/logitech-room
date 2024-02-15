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
import CameraImg from "../../../assets/images/items/camera.jpg";
import MicImg from "../../../assets/images/items/mic.jpg";
import ControllerImg from "../../../assets/images/items/controller.jpg";
import AccessImg from "../../../assets/images/items/access.jpg";
import ServiceImg from "../../../assets/images/items/service.jpg";
import { PlatformName, RoomSizeName, ServiceName, SoftwareServicesName } from '../../../utils/permissionUtils'

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
      cards: getPlatformCardData(),
    },
    [StepName.Services]: {
      key: StepName.Services,
      name: "Lorem Services",
      title: "Would you prefer to deploy via a dedicated video conferencing appliance, or a meeting room computer?",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      cards: getServicesCardData(),
    },
    [StepName.ConferenceCamera]: {
      key: StepName.ConferenceCamera,
      name: "Conference Camera",
      title: "Choose your conference camera.",
      subtitle: "These recommendations are based on your previous answers.",
      cards: getConferenceCameraCardData(),
    },
    [StepName.AudioExtensions]: {
      key: StepName.AudioExtensions,
      name: "Audio Extensions & Accessories",
      title: "Add room-filling audio.",
      subtitle:
        "Choose from the following audio extensions to make sure everyone can hear and be heard clearly. ",
      cards: getAudioExtensionsCardData(),
    },
    [StepName.MeetingController]: {
      key: StepName.MeetingController,
      name: "Meeting Controller & Add On",
      title: "Choose your meeting controller.",
      subtitle:
        "Select a controller that directly connects to the meeting room PC or video bar, or one that is untethered from the room system.",
      cards: getMeetingControllerCardData(),
    },
    [StepName.VideoAccessories]: {
      key: StepName.VideoAccessories,
      name: "Video Accessories",
      title: "Pick your video conferencing accessories.",
      subtitle:
        "Add features and flexibility with these video conferencing accessories.",
      cards: getVideoAccessoriesCardData(),
    },
    [StepName.SoftwareServices]: {
      key: StepName.SoftwareServices,
      name: "Software & Services",
      title: "Let’s finish up by selecting your software and services.",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      cards: getSoftwareServicesCardData(),
    },
  };
};

function getPlatformCardData(): Array<PlatformCardI> {
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
      title: "Phonebooth",
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

function getServicesCardData(): Array<ServiceCardI> {
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

function getConferenceCameraCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.ConferenceCamera,
      image: CameraImg,
      header_title: "Rally Bar",
      title: "Video Bar for Medium-Large Rooms",
      color: {
        currentColor: {
          name: "Graphite",
          value: "#434446",
        },
        colors: [
          {
            name: "Graphite",
            value: "#434446",
          },
          {
            name: "White",
            value: "#FBFBFB",
          },
        ],
      },
    },
    {
      key: StepName.ConferenceCamera,
      image: CameraImg,
      header_title: "Rally Bar Mini",
      title: "Video Bar for Small-Medium Rooms",
      color: {
        currentColor: {
          name: "Graphite",
          value: "#434446",
        },
        colors: [
          {
            name: "Graphite",
            value: "#434446",
          },
          {
            name: "White",
            value: "#FBFBFB",
          },
        ],
      },
    },
    {
      key: StepName.ConferenceCamera,
      image: CameraImg,
      header_title: "Rally Bar Huddle",
      title: "Video Bar for Huddle-Small Rooms",
      color: {
        currentColor: {
          name: "Graphite",
          value: "#434446",
        },
        colors: [
          {
            name: "Graphite",
            value: "#434446",
          },
          {
            name: "White",
            value: "#FBFBFB",
          },
        ],
      },
    },
  ];
}

function getAudioExtensionsCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.AudioExtensions,
      image: MicImg,
      header_title: "Rally Mic Pod",
      title: "Modular Mics with RightSound",
      color: {
        currentColor: {
          name: "Graphite",
          value: "#434446",
        },
        colors: [
          {
            name: "Graphite",
            value: "#434446",
          },
          {
            name: "White",
            value: "#FBFBFB",
          },
        ],
      },
      counter: {
        min: 1,
        max: 3,
        currentValue: 1,
      },
    },
    {
      key: StepName.AudioExtensions,
      image: MicImg,
      header_title: "Mic Pod Mount",
      title: "Table mount for Rally Mic Pod",
    },
    {
      key: StepName.AudioExtensions,
      image: MicImg,
      header_title: "Rally Mic Pod Hub",
      title: "Customize microphone placement",
      subtitle: "3 ports",
    },
  ];
}

function getMeetingControllerCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.MeetingController,
      image: ControllerImg,
      header_title: "LOGITECH TAP",
      title: "USB over Cat5e",
      subtitle: "Minimum (1)",
    },
    {
      key: StepName.MeetingController,
      image: ControllerImg,
      header_title: "TAP IP",
      title: "Ethernet or WiFi",
      subtitle: "Minimum (1)",
    },
    {
      key: StepName.MeetingController,
      image: ControllerImg,
      header_title: "LOGITECH TAP SCHEDULER",
      title: "Room scheduling panel",
      color: {
        currentColor: {
          name: "Graphite",
          value: "#434446",
        },
        colors: [
          {
            name: "Graphite",
            value: "#434446",
          },
          {
            name: "White",
            value: "#FBFBFB",
          },
        ],
      },
    },
  ];
}

function getVideoAccessoriesCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.VideoAccessories,
      image: AccessImg,
      header_title: "WALL MOUNT",
      title: "VESA-compatible mounting kit for Video Bars",
    },
    {
      key: StepName.VideoAccessories,
      image: AccessImg,
      header_title: "TV Mount",
      title: "TV Mount for Video Bars",
    },
    {
      key: StepName.VideoAccessories,
      image: AccessImg,
      header_title: "RALLY MIC POD EXTENSION CABLE",
      title: "10 meter (32.8 ft) extension cable",
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
      description: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      keyPermission: SoftwareServicesName.LogitechSync
    },
    {
      key: StepName.SoftwareServices,
      image: ServiceImg,
      header_title: "LOGITECH SELECT",
      title: "24/7 Enterprise-Grade Support",
      description: "Lorem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      keyPermission: SoftwareServicesName.SupportService,
      select: {
        value: {label: '3 years', value: '3 years'},
        data: [
          {label: '3 years', value: '3 years'},
          {label: 'Yes', value: 'yes'},
        ]
      }
    },
  ];
}
