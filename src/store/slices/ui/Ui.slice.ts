import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StepI } from './type'
import { getInitStepData } from './utils'
interface UIStateI {
	stepData: Array<StepI>;
	activeStep: StepI | null;
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
		changeActiveStep: (state, action: PayloadAction<StepI | null>) => {
			state.activeStep = action.payload
		},
		changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
			state.isBuilding = action.payload
		}
    
  },
});

export const { changeActiveStep, changeStatusBuilding } = uiSlice.actions;
export default uiSlice.reducer;