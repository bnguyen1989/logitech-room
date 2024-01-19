import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StepI } from './type'
import { getInitStepData } from './utils'
interface UIStateI {
	stepData: Array<StepI>;
	activeStep: StepI | null;
}

const initialState: UIStateI = {
	stepData: getInitStepData(),
	activeStep: null 
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
		changeActiveStep: (state, action: PayloadAction<StepI | null>) => {
			state.activeStep = action.payload
		}
    
  },
});

export const { changeActiveStep } = uiSlice.actions;
export default uiSlice.reducer;