import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ItemCardI, StepCardType, StepDataI, StepI, StepName } from './type'
import { getInitStepData } from './utils'
import { Permission } from '../../../models/permission/Permission'

declare const permission: Permission;
interface UIStateI {
	processInitData: boolean;
	stepData: StepDataI;
	activeStep: StepI<StepCardType> | null;
}

const initialState: UIStateI = {
	processInitData: false,
	stepData: getInitStepData(),
	activeStep: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
		changeActiveStep: (state, action: PayloadAction<StepI<StepCardType> | null>) => {
			state.activeStep = action.payload
			if (action.payload) {
				permission.changeStepName(action.payload.key);
			} else {
				permission.changeStepName(null);
			}
			
		},
		moveToStartStep: (state) => {
			permission.changeStepName(StepName.RoomSize);
			state.activeStep = state.stepData[StepName.RoomSize];
		},
		changeActiveCard: (state, action: PayloadAction<StepCardType | undefined>) => {
			const { activeStep } = state;
			if (activeStep) {
				activeStep.currentCard = action.payload;
				if(action.payload?.keyPermission) {
					permission.addActiveElementByName(action.payload.keyPermission);
				}
			}
		},
		changeValueCard: (state, action: PayloadAction<StepCardType>) => {
			const { activeStep } = state;
			if (activeStep) {
				const { cards } = activeStep;
				const index = cards.findIndex((card) => card.title === action.payload.title);
				if (index !== -1) {
					cards[index] = action.payload;
				}
			}
		},
		setDataItemStep: (state, action: PayloadAction<{
			key: StepName.AudioExtensions | StepName.ConferenceCamera | StepName.MeetingController | StepName.VideoAccessories | StepName.SoftwareServices,
			values: Array<ItemCardI>
		}>) => {
			state.stepData[action.payload.key] = {
				...state.stepData[action.payload.key],
				cards: action.payload.values,
			};
			if(state.activeStep && state.activeStep.key === action.payload.key) {
				state.activeStep = state.stepData[state.activeStep.key];
			}
		},
		changeProcessInitData: (state, action: PayloadAction<boolean>) => {
			state.processInitData = action.payload;
		}
  },
});

export const { changeActiveStep, moveToStartStep, changeActiveCard, changeValueCard, setDataItemStep, changeProcessInitData } = uiSlice.actions;
export default uiSlice.reducer;