import { RootState } from "../../..";
import {
  AudioExtensionsAccessories,
  Colors,
  ConferenceCamera,
  Csv,
  FinishModal,
  Loader,
  MainPage,
  MeetingControllerAddOn,
  Navigation,
  Order,
  PagesI,
  PagesIKeys,
  Platform,
  RemoveModal,
  RequestConsultation,
  RoomSize,
  Rooms,
  SelectProductModal,
  Services,
  SetupModal,
  ShareModal,
  SoftwareServices,
  VideoAccessories,
} from "../../../../types/textTypePage";
import { StepName } from "../../../../utils/baseUtils";
import {
  PlatformName,
  RoomSizeName,
  ServiceName,
  SoftwareServicesName,
} from "../../../../utils/permissionUtils";
import { QuestionFormI } from "../type";
import { getDataSoftwareQuestionsForm } from "./selectorsForm";

export const getAllLangPage = (state: RootState) =>
  state.ui.langText.pages as PagesI;

export const getLangPage = (keyPage: PagesIKeys) => (state: RootState) => {
  const langsPage = getAllLangPage(state);

  return langsPage[keyPage];
};

export const getGetStartedLangPage = (state: RootState): MainPage => {
  return getLangPage("mainPage")(state) as MainPage;
};

export const getRoomSizeLangPage = (state: RootState): RoomSize => {
  return getLangPage("Room Size")(state) as RoomSize;
};

export const getPlatformLangPage = (state: RootState): Platform => {
  return getLangPage("Platform")(state) as Platform;
};

export const getServicesLangPage = (state: RootState): Services => {
  return getLangPage("Services")(state) as Services;
};

export const getConferenceCameraLangPage = (
  state: RootState
): ConferenceCamera => {
  return getLangPage("Conference Camera")(state) as ConferenceCamera;
};

export const getAudioExtensionsLangPage = (
  state: RootState
): AudioExtensionsAccessories => {
  return getLangPage("Audio Extensions & Accessories")(
    state
  ) as AudioExtensionsAccessories;
};

export const getMeetingControllerLangPage = (
  state: RootState
): MeetingControllerAddOn => {
  return getLangPage("Meeting Controller & Add On")(
    state
  ) as MeetingControllerAddOn;
};

export const getVideoAccessoriesLangPage = (
  state: RootState
): VideoAccessories => {
  return getLangPage("Video Accessories")(state) as VideoAccessories;
};

export const getSoftwareServicesLangPage = (
  state: RootState
): SoftwareServices => {
  return getLangPage("Software & Services")(state) as SoftwareServices;
};

export const getSetupModalLangPage = (state: RootState): SetupModal => {
  return getLangPage("SetupModal")(state) as SetupModal;
};

export const getRoomsLangPage = (state: RootState): Rooms => {
  return getLangPage("Rooms")(state) as Rooms;
};

export const getDetailRoomLangPage = (state: RootState): Order => {
  return getLangPage("Order")(state) as Order;
};

export const getRequestConsultationLangPage = (
  state: RootState
): RequestConsultation => {
  return getLangPage("RequestConsultation")(state) as RequestConsultation;
};

export const getShareModalLangPage = (state: RootState): ShareModal => {
  return getLangPage("ShareModal")(state) as ShareModal;
};

export const getSelectProductModalLangPage = (state: RootState) => {
  return getLangPage("SelectProductModal")(state) as SelectProductModal;
};

export const getFinishModalLangPage = (state: RootState) => {
  return getLangPage("FinishModal")(state) as FinishModal;
};

export const getRemoveModalLangPage = (state: RootState) => {
  return getLangPage("RemoveModal")(state) as RemoveModal;
};

export const getColorsLangPage = (state: RootState) => {
  return getLangPage("Colors")(state) as Colors;
};

export const getNavigationLangPage = (state: RootState) => {
  return getLangPage("Navigation")(state) as Navigation;
};

export const getLoaderLangPage = (state: RootState) => {
  return getLangPage("Loader")(state) as Loader;
};

export const getCSVLangPage = (state: RootState) => {
  return getLangPage("CSV")(state) as Csv;
};

export const getLangStepDataByStepName =
  (stepName: StepName) => (state: RootState) => {
    switch (stepName) {
      case StepName.RoomSize:
        return getRoomSizeLangPage(state);
      case StepName.Platform:
        return getPlatformLangPage(state);
      case StepName.Services:
        return getServicesLangPage(state);
      case StepName.ConferenceCamera:
        return getConferenceCameraLangPage(state);
      case StepName.AudioExtensions:
        return getAudioExtensionsLangPage(state);
      case StepName.MeetingController:
        return getMeetingControllerLangPage(state);
      case StepName.VideoAccessories:
        return getVideoAccessoriesLangPage(state);
      case StepName.SoftwareServices: {
        const data = { ...getSoftwareServicesLangPage(state) };
        const { isSubmit } = getDataSoftwareQuestionsForm(state);
        if (isSubmit) {
          data.title = data.titleAfterForm;
        }
        return data;
      }
      default:
        throw new Error("Step not found");
    }
  };

export const getTitleStepByStepName =
  (stepName: StepName) => (state: RootState) => {
    const langStepData = getLangStepDataByStepName(stepName)(state);
    return langStepData.title;
  };

export const getNameStepByStepName =
  (stepName: StepName) => (state: RootState) => {
    const langStepData = getLangStepDataByStepName(stepName)(state);
    return langStepData.name;
  };

export const getSubTitleStepByStepName =
  (stepName: StepName) => (state: RootState) => {
    const langStepData = getLangStepDataByStepName(stepName)(state);
    if ("subtitle" in langStepData) return langStepData.subtitle;
    if ("subtitle1" in langStepData && "subtitle2" in langStepData) {
      return `${langStepData.subtitle1} ${langStepData.subtitle2}`;
    }
    return "";
  };

export const getPrepareCardTitleLangByKeyPermission =
  (keyPermission: string) => (state: RootState) => {
    switch (keyPermission) {
      case RoomSizeName.Phonebooth:
      case RoomSizeName.Huddle:
      case RoomSizeName.Small:
      case RoomSizeName.Medium:
      case RoomSizeName.Large:
      case RoomSizeName.Auditorium: {
        const roomSize = getRoomSizeLangPage(state);
        return roomSize.Cards[keyPermission].title;
      }
      case PlatformName.GoogleMeet:
      case PlatformName.MicrosoftTeams:
      case PlatformName.Zoom:
      case PlatformName.BYOD: {
        const platform = getPlatformLangPage(state);
        if (keyPermission === PlatformName.BYOD) {
          return platform.Cards.AditionCard[0].title;
        }
        const cards = platform.Cards as any;
        return cards[keyPermission];
      }
      case ServiceName.Android:
      case ServiceName.PC: {
        const services = getServicesLangPage(state);
        return services.Cards[keyPermission].title;
      }

      case SoftwareServicesName.SupportService:
      case SoftwareServicesName.ExtendedWarranty:
      case SoftwareServicesName.LogitechSync: {
        const softwareServices = getSoftwareServicesLangPage(state);
        return softwareServices.Cards[keyPermission].title;
      }
      default:
        return "";
    }
  };

export const getPrepareSubTitleLangByKeyPermission =
  (keyPermission: string) => (state: RootState) => {
    switch (keyPermission) {
      case RoomSizeName.Phonebooth:
      case RoomSizeName.Huddle:
      case RoomSizeName.Small:
      case RoomSizeName.Medium:
      case RoomSizeName.Large:
      case RoomSizeName.Auditorium: {
        const roomSize = getRoomSizeLangPage(state);
        return roomSize.Cards[keyPermission].subtitle;
      }
      case PlatformName.BYOD: {
        return "";
      }
      case ServiceName.Android:
      case ServiceName.PC: {
        const services = getServicesLangPage(state);
        return services.Cards[keyPermission].descriptions;
      }
      default:
        return "";
    }
  };

export const getPrepareDescriptionLangByKeyPermission =
  (keyPermission: string) => (state: RootState) => {
    switch (keyPermission) {
      case ServiceName.Android:
      case ServiceName.PC: {
        const services = getServicesLangPage(state);
        return services.Cards[keyPermission].descriptions;
      }

      case SoftwareServicesName.SupportService:
      case SoftwareServicesName.ExtendedWarranty:
      case SoftwareServicesName.LogitechSync: {
        const softwareServices = getSoftwareServicesLangPage(state);
        return softwareServices.Cards[keyPermission].description;
      }
      default:
        return "";
    }
  };

export const getDataQuestionFormCustomer =
  (version: "v1" | "v2") =>
  (state: RootState): Array<QuestionFormI> => {
    const langPage = getSoftwareServicesLangPage(state);
    const { QuestionForm } = langPage;

    return QuestionForm[version].reduce<QuestionFormI[]>((acc, item, index) => {
      const { question, ...options } = item;

      const copyOptions: any = { ...options };

      const keyOptions = Object.keys(copyOptions).filter((key) =>
        key.includes("option")
      );
      const questionForm = {
        question,
        options: keyOptions.map((key) => {
          return {
            value: false,
            text: copyOptions[key],
          };
        }),
        active: index === 0,
        done: false,
      };

      acc.push(questionForm);

      return acc;
    }, []);
  };

export const getLangDescriptionRoomBySize =
  (size: string) => (state: RootState) => {
    const roomPage = getRoomsLangPage(state);
    const card = roomPage.card;
    switch (size) {
      case RoomSizeName.Phonebooth:
      case RoomSizeName.Huddle:
      case RoomSizeName.Small:
      case RoomSizeName.Medium:
      case RoomSizeName.Large: {
        return card.descriptionRoomBySize[size];
      }
      case RoomSizeName.Auditorium:
        return card.descriptionRoomBySize[RoomSizeName.Large];
      default:
        return "";
    }
  };
