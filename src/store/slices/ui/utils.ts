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
import ImagePhonebooth from "../../../assets/images/rooms/phonebooth.jpg";
import ImageHundle from "../../../assets/images/rooms/huddle.jpg";
import ImageSmall from "../../../assets/images/rooms/small.jpg";
import ImageMedium from "../../../assets/images/rooms/medium.jpg";
import ImageLarge from "../../../assets/images/rooms/large.jpg";
import ImageAuditorium from "../../../assets/images/rooms/auditorium.jpg";
import ImageAppliance from "../../../assets/images/services/appliance.jpg";
import ImagePCBased from "../../../assets/images/services/pc_baced.jpg";
import MicImg from "../../../assets/images/items/mic.jpg";


export const getInitStepData = (): StepDataI => {
  return {
    [StepName.Platform]: {
      name: "Choose Platform",
      title: "What is your primary video conferencing platform?",
      subtitle:
        "Choose the video conferencing platform your organization uses most often.",
      cards: getPlatformCardData(),
    },
    [StepName.RoomSize]: {
      name: "Room Size",
      title: "How many seats are in the space?",
      subtitle:
        "Choose the option that best matches the seating capacity of your room.",
      cards: getRoomCardData(),
    },
    [StepName.Services]: {
      name: "Lorem Services",
      title: "Lorem ipsum dolor sit amet adipiscing elit?",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      cards: getServicesCardData(),
    },
    [StepName.ConferenceCamera]: {
      name: "Conference Camera",
      title: "Choose your conference camera.",
      subtitle: "These recommendations are based on your previous answers.",
      cards: getItemsCardData(),
    },
    [StepName.AudioExtensions]: {
      name: "Audio Extensions & Accessories",
      title: "Add room-filling audio.",
      subtitle:
        "Choose from the following audio extensions to make sure everyone can hear and be heard clearly. ",
      cards: getItemsCardData(),
    },
    [StepName.MeetingController]: {
      name: "Meeting Controller & Add On",
      title: "Choose your meeting controller.",
      subtitle:
        "Select a controller that directly connects to the meeting room PC or video bar, or one that is untethered from the room system.",
      cards: getItemsCardData(),
    },
    [StepName.VideoAccessories]: {
      name: "Video Accessories",
      title: "Pick your video conferencing accessories.",
      subtitle:
        "Add features and flexibility with these video conferencing accessories.",
      cards: getItemsCardData(),
    },
    [StepName.SoftwareServices]: {
      name: "Software & Services",
      title: "Let’s finish up by selecting your software and services.",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      cards: getItemsCardData(),
    },
  };
};

function getPlatformCardData(): Array<PlatformCardI> {
  return [
    {
			key: StepName.Platform,
      logo: LogoGoogle,
      image: DeviceMS,
      title: "Google Meet Room",
    },
    {
			key: StepName.Platform,
      logo: LogoMS,
      image: DeviceMS,
      title: "Microsoft Teams Room",
    },
    {
			key: StepName.Platform,
      logo: LogoZoom,
      image: DeviceMS,
      title: "Zoom Room",
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
    },
    {
			key: StepName.RoomSize,
      image: ImageHundle,
      title: "Huddle Room",
      subtitle: "up to 6",
    },
    {
			key: StepName.RoomSize,
      image: ImageSmall,
      title: "Small Room",
      subtitle: "up to 8",
    },
    {
			key: StepName.RoomSize,
      image: ImageMedium,
      title: "Medium Room",
      subtitle: "up to 12",
    },
    {
			key: StepName.RoomSize,
      image: ImageLarge,
      title: "Large/Boardroom",
      subtitle: "up to 20",
    },
    {
			key: StepName.RoomSize,
      image: ImageAuditorium,
      title: "Auditorium",
      subtitle: "over 20",
    },
  ];
}

function getServicesCardData(): Array<ServiceCardI> {
  return [
    {
			key: StepName.Services,
      image: ImageAppliance,
      title: "Appliance",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis sapien fringilla, molestie nisl ut, venenatis elit.",
    },
    {
			key: StepName.Services,
      image: ImagePCBased,
      title: "PC based",
      subtitle:
        "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris eleifend vitae odio non elementum.",
    },
  ];
}

function getItemsCardData(): Array<ItemCardI> {
  return [
    {
      key: StepName.ConferenceCamera,
      image: MicImg,
      header_title: 'Rally Mic Pod',
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
      key: StepName.ConferenceCamera,
      image: MicImg,
      header_title: 'Mic Pod Mount',
      title: "Table mount for Rally Mic Pod",
    },
    {
      key: StepName.ConferenceCamera,
      image: MicImg,
      header_title: 'Rally Mic Pod Hub',
      title: "Customize microphone placement",
      subtitle: '3 ports'
    },
  ]
}
