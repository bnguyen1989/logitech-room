import { RootState } from "../../../";
import { Permission } from "../../../../models/permission/Permission";
import { MountElement } from "../../../../models/permission/elements/mounts/MountElement";
import { MetadataI } from "../../../../services/Threekit/type";
import { StepName, getSeparatorItemColor } from "../../../../utils/baseUtils";
import { PlatformName } from "../../../../utils/permissionUtils";
import { replaceArrValues } from "../../../../utils/strUtils";
import { CardI, StepI } from "../type";
import { getLangProductCard } from "./selectoreLangProduct";
import {
  getPrepareCardTitleLangByKeyPermission,
  getSubTitleStepByStepName,
  getTitleStepByStepName,
} from "./selectoteLangPage";

export const getSelectData = (state: RootState) => state.ui.selectedData;

export const getStepData = (state: RootState) => state.ui.stepData;

export const getActiveStep = (state: RootState) => state.ui.activeStep;

export const getDataStepByName = (stepName: StepName) => (state: RootState) =>
  state.ui.stepData[stepName];

export const getActiveStepData = (state: RootState) => {
  const activeStep = getActiveStep(state);
  const dataStep = getCorrectStepDataByPermission(activeStep)(state);

  if (activeStep === StepName.ConferenceCamera) {
    dataStep.subtitle = getFormattingSubtitleByState(dataStep.subtitle)(state);
  }

  return dataStep;
};

export const getNavigationStepData = (state: RootState) => {
  const { activeStep } = state.ui;

  const { prevStep, nextStep } = getPrevNextStepByStepName(activeStep)(state);

  return {
    prevStep,
    nextStep,
  };
};

export const getPrevNextStepByStepName =
  (stepName: StepName) => (state: RootState) => {
    const { stepData } = state.ui;

    const listStepData = Object.values(stepData);

    const currentStepIndex = listStepData.findIndex(
      (step) => step.key === stepName
    );

    let prevStep;
    let nextStep;

    if (currentStepIndex !== -1) {
      const permission = getPermission(stepName)(state);
      let prevStepIndex = currentStepIndex - 1;
      let nextStepIndex = currentStepIndex + 1;

      while (prevStepIndex >= 0) {
        const step = listStepData[prevStepIndex];
        const permissionStep = permission.getStepByName(step.key);
        if (permissionStep.getAvailable()) {
          prevStep = step;
          break;
        }
        prevStepIndex--;
      }

      while (nextStepIndex < listStepData.length) {
        const step = listStepData[nextStepIndex];
        const permissionStep = permission.getStepByName(step.key);
        if (permissionStep.getAvailable()) {
          nextStep = step;
          break;
        }
        nextStepIndex++;
      }
    }

    return {
      prevStep,
      nextStep,
    };
  };

export const getIsConfiguratorStep = (state: RootState) => {
  const { activeStep } = state.ui;

  return ![StepName.Platform, StepName.RoomSize, StepName.Services].includes(
    activeStep
  );
};

export const getIsIncludePlayer = (state: RootState) => {
  const { activeStep } = state.ui;

  return ![
    StepName.Platform,
    StepName.RoomSize,
    StepName.Services,
    StepName.SoftwareServices,
  ].includes(activeStep);
};

export const getIsProcessInitData = (state: RootState) =>
  state.ui.processInitData;

export const getSelectedRoomSizeCard = (state: RootState) => {
  const selectedPrepareCards = getSelectedPrepareCards(state);
  return selectedPrepareCards.find((card) => card.key === StepName.RoomSize);
};

export const getSelectedPrepareCards = (state: RootState) => {
  const configuratorStepName = [
    StepName.Platform,
    StepName.RoomSize,
    StepName.Services,
  ];

  const result: CardI[] = [];
  configuratorStepName.forEach((stepName) => {
    const selectedCards = getSelectedCardsByStep(stepName)(state);
    result.push(...selectedCards);
  });

  return result;
};

export const getSelectedConfiguratorCards = (state: RootState) => {
  const configuratorStepName = [
    StepName.ConferenceCamera,
    StepName.AudioExtensions,
    StepName.MeetingController,
    StepName.VideoAccessories,
    StepName.SoftwareServices,
  ];

  const result: CardI[] = [];
  configuratorStepName.forEach((stepName) => {
    const selectedCards = getSelectedCardsByStep(stepName)(state);
    result.push(...selectedCards);
  });

  return result;
};

export const getSelectedCardsByStep =
  (stepName: StepName) => (state: RootState) => {
    const selectedData = getSelectData(state);
    const cards = getCardsByStep(stepName)(state);
    const selectedDataItem = selectedData[stepName] || {};

    return Object.entries(selectedDataItem).reduce((acc, [key, value]) => {
      const isSelected = value.selected.length > 0;
      const isExist = cards[key];
      if (isSelected && isExist) {
        acc.push(cards[key]);
      }
      return acc;
    }, [] as CardI[]);
  };

export const getCardsByStep = (stepName: StepName) => (state: RootState) => {
  const stepData = getStepData(state);
  return stepData[stepName].cards;
};

export const getCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const stepData = getStepData(state);
    const cards = stepData[stepName].cards;
    return cards[keyPermission];
  };

export const getSelectedDataByStepName =
  (stepName: StepName) => (state: RootState) => {
    const selectedData = getSelectData(state);
    return selectedData[stepName] ?? {};
  };

export const getSelectedDataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const stepSelectData = getSelectedDataByStepName(stepName)(state);
    if (!stepSelectData) return;
    return stepSelectData[keyPermission];
  };

export const getPropertyCounterCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
    return data?.property.count;
  };

export const getPropertySelectValueCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
    return data?.property.select;
  };

export const getIsSelectedCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
    if (!data) return false;
    return data.selected.length > 0;
  };

export const getAllAssetFromCard =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);
    return card.dataThreekit.threekitItems;
  };

export const getAssetFromCard = (card: CardI) => (state: RootState) => {
  const threekitItems = card.dataThreekit.threekitItems;
  const keyPermission = card.keyPermission;
  const stepName = card.key;

  const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
  const color = data?.property.color;
  if (!color) return threekitItems[keyPermission];

  const separatorItemColor = getSeparatorItemColor();
  const nameAsset = `${keyPermission}${separatorItemColor}${color}`;
  const asset = threekitItems[nameAsset];
  if (asset) return asset;

  const keys = Object.keys(threekitItems).filter((key) => key.includes(color));
  return threekitItems[keys[0]];
};

export const getMetadataAssetFromCard = (card: CardI) => (state: RootState) => {
  const threekitAsset = getAssetFromCard(card)(state);

  return threekitAsset?.metadata;
};
export const getMetadataProductNameAssetFromCard =
  (card: CardI) => (state: RootState) => {
    const metadata = getMetadataAssetFromCard(card)(state);
    if (!metadata) return "";

    return getProductNameFromMetadata(metadata);
  };

export const getSkuFromMetadataByCard = (card: CardI) => (state: RootState) => {
  const metadata = getMetadataAssetFromCard(card)(state);
  if (!metadata) return "";

  return metadata["SKU"]?.trim() ?? "";
};

export const getSubTitleCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);
    if (!card.counter) return;
    const { min } = card.counter;
    if (min > 0) return `Minimum (${min})`;
    return card.subtitle;
  };

export const getTitleCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);
    const productName = getMetadataProductNameAssetFromCard(card)(state);
    const langDataCard = getLangProductCard(productName)(state);
    if (langDataCard) {
      return langDataCard.ProductName;
    }
    const titlePrepareCard =
      getPrepareCardTitleLangByKeyPermission(keyPermission)(state);
    if (titlePrepareCard) return titlePrepareCard;
    const title = getMetadataProductNameAssetFromCard(card)(state);
    if (title) return title;
    return "";
  };

export const getLocale = (state: RootState) => state.ui.locale;

export const getPriceFromMetadataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const locale = getLocale(state);
    const metadata = getMetadataByKeyPermission(stepName, keyPermission)(state);
    const keyPrice = `Price_${locale.toLowerCase()}`;
    return metadata?.[keyPrice] || "0.000";
  };

export const getStepNameByKeyPermission =
  (keyPermission: string) => (state: RootState) => {
    const stepData = getStepData(state);
    const step = Object.entries(stepData).filter((item) => {
      return !!item[1].cards[keyPermission];
    });
    return step[0][0] as StepName;
  };

export const getMetadataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);
    const asset = getAssetFromCard(card)(state);
    return asset?.metadata;
  };

export const getIsRecommendedCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const metadata = getMetadataByKeyPermission(stepName, keyPermission)(state);
    if (!metadata) return false;
    const isRecommendedMetadata = getIsRecommendedCardFromMetadata(metadata);
    if (isRecommendedMetadata) return true;

    const permission = getPermission(stepName)(state);
    const currentStep = permission.getCurrentStep();
    const element = currentStep.getElementByName(keyPermission);
    if (!element) return false;
    return element.getRecommended();
  };

export const getIsRecommendedCardByCard =
  (card: CardI) => (state: RootState) => {
    const metadata = getMetadataAssetFromCard(card)(state);
    if (!metadata) return false;
    return getIsRecommendedCardFromMetadata(metadata);
  };

export const getIsCanChangeStep = (state: RootState) => {
  const permission = getPermission()(state);
  const isCanChange = permission.canNextStep();
  if (!isCanChange) return false;
  const activeStep = getActiveStep(state);
  const stepData = getDataStepByName(activeStep)(state);
  const requiredCards = Object.values(stepData.cards).filter((card) =>
    getRequiredFromMetadataByCard(card)(state)
  );
  if (requiredCards.length === 0) return true;
  const selectedCards = getSelectedCardsByStep(activeStep)(state);
  const activeCardKeys = selectedCards.map((card) => card.keyPermission);
  return requiredCards.some((card) =>
    activeCardKeys.includes(card.keyPermission)
  );
};

export const getRequiredFromMetadataByCard =
  (card: CardI) => (state: RootState) => {
    const metadata = getMetadataAssetFromCard(card)(state);
    if (!metadata) return false;
    return metadata["Required"] === "true";
  };

export const getSecondaryCardsFromStep =
  (stepData: StepI) => (state: RootState) => {
    const cards = Object.values(stepData.cards);
    const permission = getPermission(stepData.key)(state);
    return cards.filter((card) => {
      return permission.isSecondaryElementByName(card.keyPermission);
    });
  };

export const getPermission = (stepName?: StepName) => (state: RootState) => {
  const currentStep = stepName ?? getActiveStep(state);
  const activeKeys = getAllKeyActiveCards(state);
  const initData = getInitDataCardsForPermission(state);
  return new Permission(activeKeys, initData, currentStep);
};

export const getCorrectStepDataByPermission =
  (stepName: StepName) => (state: RootState) => {
    const dataStep = getDataStepByName(stepName)(state);

    const copyDataStep = JSON.parse(JSON.stringify(dataStep)) as StepI;
    const permission = getPermission(stepName)(state);
    const items = permission.getElements();

    const correctDataCards = Object.values(copyDataStep.cards).reduce<
      Record<string, CardI>
    >((acc, card) => {
      const isExist = items.some((item) => item.name === card.keyPermission);
      if (isExist) {
        acc[card.keyPermission] = card;
      }
      return acc;
    }, {});

    copyDataStep.cards = {
      ...correctDataCards,
    };

    const title = getTitleStepByStepName(stepName)(state);
    copyDataStep.title = title;
    const subtitle = getSubTitleStepByStepName(stepName)(state);
    copyDataStep.subtitle = subtitle;

    return copyDataStep;
  };

export const getFormattingSubtitleByState =
  (text: string) => (state: RootState) => {
    const selectedPrepareCards = getSelectedPrepareCards(state);
    const getName = (name: string) => `<b>${name}</b>`;
    const roomSizeCard = selectedPrepareCards.find(
      (card: { key: string }) => card.key === StepName.RoomSize
    );
    const platformCard = selectedPrepareCards.find(
      (card: { key: string }) => card.key === StepName.Platform
    );
    const serviceCard = selectedPrepareCards.find(
      (card: { key: string }) => card.key === StepName.Services
    );

    const arrValues: string[] = [];

    if (roomSizeCard) {
      const roomSizeTile = getTitleCardByKeyPermission(
        StepName.RoomSize,
        roomSizeCard.keyPermission
      )(state);
      arrValues.push(getName(roomSizeTile));
    }

    if (platformCard) {
      const platformTile = getTitleCardByKeyPermission(
        StepName.Platform,
        platformCard.keyPermission
      )(state);
      arrValues.push(getName(platformTile));

      if (platformCard?.keyPermission === PlatformName.BYOD) {
        arrValues.push(getName(platformTile));
      }
    }

    if (serviceCard) {
      const serviceTile = getTitleCardByKeyPermission(
        StepName.Services,
        serviceCard.keyPermission
      )(state);
      arrValues.push(getName(serviceTile));
    }

    text = replaceArrValues(text, arrValues);

    return text;
  };

export const getDisabledActionByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const res = {
      counter: false,
      color: false,
    };
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!step) return res;
    const element = step.getElementByName(keyPermission);
    if (!element) return res;
    res.counter = element.getDisabledCounter();
    res.color = element.getDisabledColor();
    return res;
  };
export const getHiddenActionByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const res = {
      color: false,
    };
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!step) return res;
    const element = step.getElementByName(keyPermission);
    if (!element) return res;

    res.color = element.getHiddenColor();

    return res;
  };

export const getAllKeyActiveCards = (state: RootState) => {
  const selectedData = getSelectData(state);
  return Object.values(selectedData).reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      if (item[key].selected.length) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);
};

export const getPositionStepNameBasedOnActiveStep =
  (stepName: StepName) =>
  (state: RootState): "prev" | "next" | "current" => {
    const activeStep = getActiveStep(state);
    const stepData = getStepData(state);
    const steps = Object.keys(stepData);
    const positionActiveStep = steps.indexOf(activeStep);
    const positionStep = steps.indexOf(stepName);
    if (positionStep < positionActiveStep) return "prev";
    if (positionStep > positionActiveStep) return "next";
    return "current";
  };

export const getSubCardsKeyPermissionStep =
  (step: StepI) =>
  (state: RootState): Record<string, string[]> => {
    const permission = getPermission(step.key)(state);
    const cards = Object.values(step.cards);
    const cardsKeyPermissions = cards.map((card) => card.keyPermission);
    return cards.reduce<Record<string, string[]>>((acc, card) => {
      const currentStep = permission.getCurrentStep();
      const element = currentStep.getElementByName(card.keyPermission);
      if (!element || element instanceof MountElement) return acc;
      const accessItems = element.getAccessoryItems();
      acc[card.keyPermission] = cardsKeyPermissions.filter((key) =>
        accessItems.includes(key)
      );
      return acc;
    }, {});
  };

const getInitDataCardsForPermission = (state: RootState) => {
  const res: Record<string, Record<string, any>> = {};
  const selectedData = getSelectData(state);
  Object.entries(selectedData).forEach(([stepName, value]) => {
    Object.keys(value).forEach((key) => {
      const card = getCardByKeyPermission(stepName as StepName, key)(state);
      let obj = {};
      if (card?.counter) {
        obj = {
          counterMin: card.counter.min,
          counterMax: card.counter.max,
        };
      }

      res[key] = {
        ...value[key].property,
        ...obj,
      };
    });
  });
  return res;
};

const getIsRecommendedCardFromMetadata = (metadata: Record<string, string>) => {
  const isRecommended = metadata["isRecommended"];
  if (isRecommended !== undefined) {
    return isRecommended === "true";
  }
  return false;
};

export const getProductNameFromMetadata = (metadata: MetadataI) => {
  return metadata["Product Name"]?.trim();
};
