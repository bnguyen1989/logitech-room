import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ItemCardI,
  PlatformCardI,
  RoomCardI,
  ServiceCardI,
  StepCardType,
  StepDataI,
  StepI,
  StepName,
} from "./type";
import { getInitStepData } from "./utils";
import { Permission } from "../../../models/permission/Permission";

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
  name: "ui",
  initialState,
  reducers: {
    changeActiveStep: (
      state,
      action: PayloadAction<StepI<StepCardType> | null>
    ) => {
      state.activeStep = action.payload;
    },
    moveToStartStep: (state) => {
      permission.changeStepName(StepName.RoomSize);
      state.activeStep = state.stepData[StepName.RoomSize];
    },
    addActiveCard: (state, action: PayloadAction<StepCardType>) => {
      const { activeStep } = state;
      if (activeStep) {
        const isExist = activeStep.activeCards.some(
          (card) => card.keyPermission === action.payload.keyPermission
        );
        if (!isExist) {
          const activeItems = permission.getActiveItems();
          const activeCards = activeStep.activeCards.filter((card) =>
            activeItems.some((item) => item.name === card.keyPermission)
          );
          
          activeStep.activeCards = [...activeCards, action.payload];
        }
      }
    },
    removeActiveCard: (state, action: PayloadAction<StepCardType>) => {
      const { activeStep } = state;
      if (activeStep && action.payload) {
        const index = activeStep.activeCards.findIndex(
          (card) => card.title === action.payload.title
        );
        if (index !== -1) {
          activeStep.activeCards.splice(index, 1);
        }
      }
    },
    setActiveCardsForStep: (
      state,
      action: PayloadAction<{
        key: StepName;
        cards: Array<StepCardType>;
      }>
    ) => {
      const { stepData } = state;
      if (action.payload.key == StepName.RoomSize) {
        stepData[action.payload.key].activeCards = action.payload
          .cards as Array<RoomCardI>;
      }
      if (action.payload.key == StepName.Platform) {
        stepData[action.payload.key].activeCards = action.payload
          .cards as Array<PlatformCardI>;
      }
      if (action.payload.key == StepName.Services) {
        stepData[action.payload.key].activeCards = action.payload
          .cards as Array<ServiceCardI>;
      }
      stepData[action.payload.key].activeCards = action.payload
        .cards as Array<ItemCardI>;
    },
    changeValueCard: (state, action: PayloadAction<StepCardType>) => {
      const { activeStep } = state;
      if (activeStep) {
        const { cards } = activeStep;
        const index = cards.findIndex(
          (card) => card.title === action.payload.title
        );
        if (index !== -1) {
          cards[index] = action.payload;
        }
      }
    },
    setDataItemStep: (
      state,
      action: PayloadAction<{
        key:
          | StepName.AudioExtensions
          | StepName.ConferenceCamera
          | StepName.MeetingController
          | StepName.VideoAccessories
          | StepName.SoftwareServices;
        values: Array<ItemCardI>;
      }>
    ) => {
      state.stepData[action.payload.key] = {
        ...state.stepData[action.payload.key],
        cards: action.payload.values,
      };
      if (state.activeStep && state.activeStep.key === action.payload.key) {
        state.activeStep = state.stepData[state.activeStep.key];
      }
    },
    setDataPrepareStep: (
      state,
      action: PayloadAction<{
        key: StepName.Platform | StepName.Services;
        values: Array<PlatformCardI | ServiceCardI>;
      }>
    ) => {
      if (action.payload.key === StepName.Platform) {
        state.stepData[action.payload.key] = {
          ...state.stepData[action.payload.key],
          cards: action.payload.values as Array<PlatformCardI>,
        };
      }
      if (action.payload.key === StepName.Services) {
        state.stepData[action.payload.key] = {
          ...state.stepData[action.payload.key],
          cards: action.payload.values as Array<ServiceCardI>,
        };
      }
      if (state.activeStep && state.activeStep.key === action.payload.key) {
        state.activeStep = state.stepData[state.activeStep.key];
      }
    },
    changeProcessInitData: (state, action: PayloadAction<boolean>) => {
      state.processInitData = action.payload;
    },
  },
});

export const {
  changeActiveStep,
  moveToStartStep,
  addActiveCard,
  removeActiveCard,
  setActiveCardsForStep,
  changeValueCard,
  setDataItemStep,
  changeProcessInitData,
  setDataPrepareStep,
} = uiSlice.actions;
export default uiSlice.reducer;
