import { RootState } from "../../../";
import { Permission } from "../../../../models/permission/Permission";
import { StepName } from "../type";
import { formattingSubtitleByState } from "../utils";

declare const permission: Permission;

export const getStepData = (state: RootState) => state.ui.stepData;

export const getActiveStep = (state: RootState) => state.ui.activeStep;

export const getDataStepByName = (stepName: StepName) => (state: RootState) =>
  state.ui.stepData[stepName];

export const getActiveStepData = (state: RootState) => {
  const activeStep = getActiveStep(state);
  const dataStep = getDataStepByName(activeStep)(state);

  const copyDataStep = JSON.parse(JSON.stringify(dataStep));
  const items = permission.getElements();

  copyDataStep.cards = copyDataStep.cards.filter((card: any) =>
    items.some((item) => item.name === card.keyPermission)
  );

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
  const { stepData } = state.ui;
  const roomCards = stepData[StepName.RoomSize].cards;
  const platformCards = stepData[StepName.Platform].cards;
  const serviceCards = stepData[StepName.Services].cards;
  const prepareCards = [...roomCards, ...platformCards, ...serviceCards];

  return prepareCards.filter((card) => {
    const key = card.keyPermission;
    const currentStep = permission.getCurrentStep();
    if (!currentStep) return false;
    const chainActiveElements = currentStep.getChainActiveElements();
    return chainActiveElements.some((chainActiveElement) =>
      chainActiveElement.some((activeElement) => activeElement.name === key)
    );
  });
};

export const getSelectedConfiguratorCards = (state: RootState) => {
  const { stepData } = state.ui;
  const configuratorCards = [
    ...stepData[StepName.ConferenceCamera].cards,
    ...stepData[StepName.AudioExtensions].cards,
    ...stepData[StepName.MeetingController].cards,
    ...stepData[StepName.AudioExtensions].cards,
    ...stepData[StepName.SoftwareServices].cards,
  ];

  return configuratorCards.filter((card) => {
    const key = card.keyPermission;
    const currentStep = permission.getCurrentStep();
    if (!currentStep) return false;
    const chainActiveElements = currentStep.getChainActiveElements();
    return chainActiveElements.some((chainActiveElement) =>
      chainActiveElement.some(
        (activeElement) =>
          activeElement.name === key && activeElement.getVisible()
      )
    );
  });
};
