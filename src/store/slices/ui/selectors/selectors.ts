import { RootState } from '../../../'
import { Permission } from '../../../../models/permission/Permission'
import { StepName } from '../type'

declare const permission: Permission;

export const getStepData = (state: RootState) => state.ui.stepData;
export const getActiveStep = (state: RootState) => {
	let activeStep = state.ui.activeStep;
	if(activeStep) {
		activeStep = {...activeStep};
		const items = permission.getElements();
		activeStep.cards = [...activeStep.cards].filter(card => items.some(item => item.name === card.keyPermission));
	}

	return activeStep;
};

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

export const getIsProcessInitData = (state: RootState) => state.ui.processInitData;