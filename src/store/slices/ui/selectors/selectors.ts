import { RootState } from '../../../'

export const getStepData = (state: RootState) => state.ui.stepData;
export const getActiveStep = (state: RootState) => state.ui.activeStep;

export const getNavigationStepData = (state: RootState) => {
	const { stepData, activeStep } = state.ui;

	const currentStepIndex = stepData.findIndex(step => step.title === activeStep?.title);

	return {
		prevStep: stepData[currentStepIndex - 1],
		nextStep: stepData[currentStepIndex + 1]
	}
}

export const getIsBuilding = (state: RootState) => state.ui.isBuilding;