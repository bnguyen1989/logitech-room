import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ItemCardI,
  PlatformCardI,
  RoomCardI,
  SelectedDataI,
  ServiceCardI,
  StepCardType,
  StepDataI,
  StepName,
} from "./type";
import { getInitStepData } from "./utils";
import { Permission } from "../../../models/permission/Permission";

declare const permission: Permission;
interface UIStateI {
  processInitData: boolean;
  stepData: StepDataI;
  activeStep: StepName;
  selectedData: SelectedDataI;
}

const initialState: UIStateI = {
  processInitData: false,
  stepData: getInitStepData(),
  activeStep: StepName.Services,
  selectedData: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeActiveStep: (state, action: PayloadAction<StepName>) => {
      state.activeStep = action.payload;
    },
    moveToStartStep: (state) => {
      permission.changeStepName(StepName.RoomSize);
      state.activeStep = StepName.RoomSize;
    },
    createItem: (
      state,
      action: PayloadAction<{
        step: string;
        keyItemPermission: string;
      }>
    ) => {
      const { step, keyItemPermission } = action.payload;
      const stepData = state.selectedData[step] ?? {};
      const cardData = stepData[keyItemPermission] ?? {
        selected: [],
        property: {},
      };
      state.selectedData[step] = {
        ...stepData,
        [keyItemPermission]: cardData,
      };
    },
    setPropertyItem: (
      state,
      action: PayloadAction<{
        step: string;
        keyItemPermission: string;
        property: Record<string, any>;
      }>
    ) => {
      const { step, keyItemPermission, property } = action.payload;

      const stepData = state.selectedData[step] ?? {};
      const cardData = stepData[keyItemPermission] ?? {
        selected: [],
        property: {},
      };

      const updatedCardData = {
        ...cardData,
        property: {
          ...cardData.property,
          ...property,
        },
      };

      state.selectedData[step] = {
        ...stepData,
        [keyItemPermission]: updatedCardData,
      };
    },
    addActiveCard: (state, action: PayloadAction<StepCardType>) => {
      const { activeStep } = state;
      const cards = state.stepData[activeStep].activeCards;
      const isExist = cards.some(
        (card) => card.keyPermission === action.payload.keyPermission
      );
      if (!isExist) {
        const activeItems = permission.getActiveItems();
        const activeCards = cards.filter((card) =>
          activeItems.some((item) => item.name === card.keyPermission)
        );

        state.stepData[activeStep].activeCards = [
          ...activeCards,
          action.payload,
        ] as any;
      }
    },
    removeActiveCard: (state, action: PayloadAction<StepCardType>) => {
      const { activeStep } = state;
      const index = state.stepData[activeStep].activeCards.findIndex(
        (card) => card.title === action.payload.title
      );
      if (index !== -1) {
        state.stepData[activeStep].activeCards.splice(index, 1);
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
      const { activeStep, stepData } = state;
      const { cards } = stepData[activeStep];
      const index = cards.findIndex(
        (card) => card.title === action.payload.title
      );
      if (index !== -1) {
        cards[index] = action.payload;
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
  setPropertyItem,
  createItem,
} = uiSlice.actions;
export default uiSlice.reducer;
