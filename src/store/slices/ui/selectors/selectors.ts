import { RootState } from "../../../";
import { Permission } from "../../../../models/permission/Permission";
import { getSeparatorItemColor } from "../../../../utils/baseUtils";
import { CardI, StepI, StepName } from "../type";
import { getTitleFromDataByKeyPermission } from "../utils";

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
  const { stepData, activeStep } = state.ui;

  const listStepData = Object.values(stepData);

  const currentStepIndex = listStepData.findIndex(
    (step) => step.key === activeStep
  );

  return {
    prevStep: listStepData[currentStepIndex - 1],
    nextStep: listStepData[currentStepIndex + 1],
  };
};

export const getIsConfiguratorStep = (state: RootState) => {
  const { activeStep } = state.ui;

  return ![StepName.Platform, StepName.RoomSize, StepName.Services].includes(
    activeStep
  );
};

export const getIsProcessInitData = (state: RootState) =>
  state.ui.processInitData;

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
    StepName.AudioExtensions,
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
    const stepData = getStepData(state);
    const cards = stepData[stepName].cards;
    const selectedDataItem = selectedData[stepName] || {};

    return Object.entries(selectedDataItem).reduce((acc, [key, value]) => {
      if (value.selected.length) {
        acc.push(cards[key]);
      }
      return acc;
    }, [] as CardI[]);
  };

export const getCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const stepData = getStepData(state);
    const cards = stepData[stepName].cards;
    return cards[keyPermission];
  };

export const getSelectedDataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const selectedData = getSelectData(state);
    const stepSelectData = selectedData[stepName];
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
  (keyItemPermission: string) => (state: RootState) => {
    const activeStep = getActiveStep(state);
    const card = getCardByKeyPermission(activeStep, keyItemPermission)(state);
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
  return threekitItems[nameAsset];
};

export const getTitleCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const title = getTitleFromMetadataByKeyPermission(
      stepName,
      keyPermission
    )(state);
    if (title) return title;

    return getTitleFromDataByKeyPermission(keyPermission);
  };

export const getTitleFromMetadataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);
    const asset = getAssetFromCard(card)(state);
    if (!asset) return;
    const metadata = getMetadataByKeyPermission(stepName, keyPermission)(state);
    return metadata["Product Name"] || metadata["Name"] || asset?.name;
  };

export const getPriceFromMetadataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const metadata = getMetadataByKeyPermission(stepName, keyPermission)(state);
    return metadata?.Price || "0.000";
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

export const getKeyActiveCards = (state: RootState) => {
  const res: Array<string> = [];
  const selectedData = getSelectData(state);
  Object.values(selectedData).forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (item[key].selected.length) {
        res.push(key);
      }
    });
  });
  return res;
};

export const getIsRecommendedCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const card = getCardByKeyPermission(stepName, keyPermission)(state);

    const activeKeys = getKeyActiveCards(state);
    const permission = new Permission(activeKeys, stepName);
    return (
      card?.recommended || permission.isRecommendedElementByName(keyPermission)
    );
  };

export const getIsCanChangeStep = (state: RootState) => {
  const permission = getPermission()(state);
  return permission.canNextStep();
};

export const getPermission = (stepName?: StepName) => (state: RootState) => {
  const currentStep = stepName ?? getActiveStep(state);
  const activeKeys = getKeyActiveCards(state);
  return new Permission(activeKeys, currentStep);
};

export const getCorrectStepDataByPermission =
  (stepName: StepName) => (state: RootState) => {
    const dataStep = getDataStepByName(stepName)(state);

    const copyDataStep = JSON.parse(JSON.stringify(dataStep)) as StepI;
    const permission = getPermission(stepName)(state);
    const items = permission.getElements();

    Object.values(dataStep.cards).forEach((card: CardI) => {
      const isExist = items.some((item) => item.name === card.keyPermission);
      if (!isExist) {
        delete copyDataStep.cards[card.keyPermission];
      }
    });

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

    if (!roomSizeCard || !platformCard || !serviceCard) return text;

    const roomSizeTile = getTitleCardByKeyPermission(
      StepName.RoomSize,
      roomSizeCard.keyPermission
    )(state);

    const platformTile = getTitleCardByKeyPermission(
      StepName.Platform,
      platformCard.keyPermission
    )(state);

    const serviceTile = getTitleCardByKeyPermission(
      StepName.Services,
      serviceCard.keyPermission
    )(state);

    return text
      .replace("{0}", getName(roomSizeTile))
      .replace("{1}", getName(platformTile))
      .replace("{2}", getName(serviceTile));
  };

export const getIsDisabledActionByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!step) return false;
    const element = step.getElementByName(keyPermission);
    if (!element) return false;
    return element.getActionDisabled();
  };
