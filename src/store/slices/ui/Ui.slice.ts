import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StepCardType, StepDataI, StepI, StepName } from './type'
import { getInitStepData } from './utils'
interface UIStateI {
	stepData: StepDataI;
	activeStep: StepI<StepCardType> | null;
}

const initialState: UIStateI = {
	stepData: getInitStepData(),
	activeStep: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
		changeActiveStep: (state, action: PayloadAction<StepI<StepCardType> | null>) => {
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
		changeValueCard: (state, action: PayloadAction<StepCardType>) => {
			const { activeStep } = state;
			if (activeStep) {
				const { cards } = activeStep;
				const index = cards.findIndex((card) => card.key === action.payload.key);
				if (index !== -1) {
					cards[index] = action.payload;
				}
			}
		},
  },
});

export const { changeActiveStep, moveToStartStep, changeActiveCard, changeValueCard } = uiSlice.actions;
export default uiSlice.reducer;