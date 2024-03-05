import { RootState } from "../../../";
import { Permission } from "../../../../models/permission/Permission";
import { StepName } from "../type";

declare const permission: Permission;

export const getStepData = (state: RootState) => state.ui.stepData;
export const getActiveStep = (state: RootState) => {
  let activeStep = state.ui.activeStep;
  
  if (activeStep) {
    activeStep = JSON.parse(JSON.stringify(activeStep));
    if(!activeStep) return null;
    const items = permission.getElements();
    
    activeStep.cards = activeStep.cards.filter((card) =>
      items.some((item) => item.name === card.keyPermission)
    );
  }

  if (activeStep?.key === StepName.ConferenceCamera) {
    const selectedPrepareCards = getSelectedPrepareCards(state);
    const roomSizeCard = selectedPrepareCards.find(
      (card) => card.key === StepName.RoomSize
    );
    const platformCard = selectedPrepareCards.find(
      (card) => card.key === StepName.Platform
    );
    const serviceCard = selectedPrepareCards.find(
      (card) => card.key === StepName.Services
    );
    if (!roomSizeCard || !platformCard || !serviceCard) return activeStep;
    const getName = (name: string) => `<b>${name}</b>`;
    
    activeStep.subtitle = activeStep.subtitle
      .replace("{0}", getName(roomSizeCard.title))
      .replace("{1}", getName(platformCard.title))
      .replace("{2}", getName(serviceCard.title));
  }

  return activeStep;
};

export const getNavigationStepData = (state: RootState) => {
  const { stepData, activeStep } = state.ui;

  const listStepData = Object.values(stepData);

  const currentStepIndex = listStepData.findIndex(
    (step) => step.title === activeStep?.title
  );

  return {
    prevStep: listStepData[currentStepIndex - 1],
    nextStep: listStepData[currentStepIndex + 1],
  };
};

export const getIsConfiguratorStep = (state: RootState) => {
  const { activeStep } = state.ui;

  if (!activeStep) {
    return false;
  }

  return ![StepName.Platform, StepName.RoomSize, StepName.Services].includes(
    activeStep.key
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
