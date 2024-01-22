import { RootState } from '../../../'

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

	return !['Choose Platform', 'Room Size', 'Lorem Services'].includes(activeStep.name);
}

export const getIsBuilding = (state: RootState) => state.ui.isBuilding;