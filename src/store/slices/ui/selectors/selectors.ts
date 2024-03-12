import { RootState } from "../../../";
import { Permission } from "../../../../models/permission/Permission";
import { CardI, StepI, StepName } from "../type";
import { formattingSubtitleByState } from "../utils";

declare const permission: Permission;

export const getSelectData = (state: RootState) => state.ui.selectedData;

export const getStepData = (state: RootState) => state.ui.stepData;

export const getActiveStep = (state: RootState) => state.ui.activeStep;

export const getDataStepByName = (stepName: StepName) => (state: RootState) =>
  state.ui.stepData[stepName];

export const getActiveStepData = (state: RootState) => {
  const activeStep = getActiveStep(state);
  const dataStep = getDataStepByName(activeStep)(state);

  const copyDataStep = JSON.parse(JSON.stringify(dataStep)) as StepI;
  const items = permission.getElements();

  Object.values(dataStep.cards).forEach((card: CardI) => {
    const isExist = items.some((item) => item.name === card.keyPermission);
    if (!isExist) {
      delete copyDataStep.cards[card.keyPermission];
    }
  });

  if (activeStep === StepName.ConferenceCamera) {
    copyDataStep.subtitle = formattingSubtitleByState(
      copyDataStep.subtitle,
      getSelectedPrepareCards(state)
    );
    return copyDataStep;
  }

  return copyDataStep;
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
    return selectedData[stepName][keyPermission];
  };

export const getPropertyColorCardByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
    return data?.property.color;
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

export const getAssetFromCard = (card: CardI) => (state: RootState) => {
  const threekitItems = card.dataThreekit.threekitItems;
  const keyPermission = card.keyPermission;
  const stepName = card.key;

  const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
  const keySelected = data?.selected[0];
  if (!keySelected) return threekitItems[keyPermission];
  return threekitItems[keySelected];
};
