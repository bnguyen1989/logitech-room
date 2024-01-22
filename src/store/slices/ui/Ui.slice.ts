import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StepCardType, StepDataI, StepI, StepName } from './type'
import { getInitStepData } from './utils'
interface UIStateI {
	stepData: StepDataI;
	activeStep: StepI<StepCardType> | null;
	isBuilding: boolean;
}

const initialState: UIStateI = {
	stepData: getInitStepData(),
	activeStep: null,
	isBuilding: false 
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
		changeActiveStep: (state, action: PayloadAction<StepI<never> | null>) => {
			state.activeStep = action.payload
		},
		moveToStartStep: (state) => {
			state.activeStep = state.stepData[StepName.Platform];
		},
		changeActiveCard: (state, action: PayloadAction<StepCardType | undefined>) => {
			const { activeStep } = state;
			if (activeStep) {
				activeStep.currentCard = action.payload;
			}
		},
		changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
			state.isBuilding = action.payload
		}
  },
});

export const { changeActiveStep, moveToStartStep, changeActiveCard, changeStatusBuilding } = uiSlice.actions;
export default uiSlice.reducer;