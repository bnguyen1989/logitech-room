import { RootState } from '../../../'
import { StepName } from '../type'

export const getStepData = (state: RootState) => state.ui.stepData;
export const getActiveStep = (state: RootState) => state.ui.activeStep;

export const getNavigationStepData = (state: RootState) => {
	const { stepData, activeStep } = state.ui;

	const listStepData = Object.values(stepData);

	const currentStepIndex = listStepData.findIndex(step => step.title === activeStep?.title);

	return {
		prevStep: listStepData[currentStepIndex - 1],
		nextStep: listStepData[currentStepIndex + 1]
	}
}

export const getIsConfiguratorStep = (state: RootState) => {
	const { activeStep } = state.ui;

	if (!activeStep) {
		return false;
	}

	return ![StepName.Platform, StepName.RoomSize, StepName.Services].includes(activeStep.key);
}