import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CardI, SelectedDataI, StepDataI, StepName } from "./type";
import { getInitStepData } from "./utils";

interface UIStateI {
  processInitData: boolean;
  stepData: StepDataI;
  activeStep: StepName;
  selectedData: SelectedDataI;
  langTextProduct: Record<string, any>;
}

const initialState: UIStateI = {
  processInitData: false,
  langTextProduct: {},
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
    setLangText: (state, action) => {
      state.langTextProduct = action.payload;
    },
    moveToStartStep: (state) => {
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
    addActiveCard: (state, action: PayloadAction<{ key: string }>) => {
      const { activeStep } = state;
      const { key } = action.payload;
      const stepData = state.selectedData[activeStep] ?? {};
      const cardData = stepData[key] ?? {
        selected: [],
        property: {},
      };
      const isExist = cardData.selected.some((item) => item === key);
      if (!isExist) {
        cardData.selected.push(key);
      }
      state.selectedData[activeStep] = {
        ...stepData,
        [key]: cardData,
      };
    },
    addActiveCards: (
      state,
      action: PayloadAction<{
        keys: string[];
      }>
    ) => {
      const { keys } = action.payload;
      const { activeStep } = state;
      const stepData = state.selectedData[activeStep] ?? {};
      keys.forEach((key) => {
        const cardData = stepData[key] ?? {
          selected: [],
          property: {},
        };
        cardData.selected = [key];
        stepData[key] = cardData;
      });
      state.selectedData[activeStep] = stepData;
    },
    removeActiveCard: (state, action: PayloadAction<{ key: string }>) => {
      const { activeStep } = state;
      const { key } = action.payload;
      const card = state.selectedData[activeStep][key];
      const index = card.selected.findIndex((item) => item === key);
      if (index !== -1) {
        card.selected.splice(index, 1);
      }
      state.selectedData[activeStep][key] = card;
    },
    removeActiveCards: (
      state,
      action: PayloadAction<{
        keys: string[];
      }>
    ) => {
      const { keys } = action.payload;
      const { activeStep } = state;
      const stepData = state.selectedData[activeStep] ?? {};
      keys.forEach((key) => {
        const card = stepData[key];
        card.selected = [];
        stepData[key] = card;
      });
      state.selectedData[activeStep] = stepData;
    },
    setActiveCardsForStep: (
      state,
      action: PayloadAction<{
        step: StepName;
        keyCards: string[];
      }>
    ) => {
      const { selectedData } = state;
      const { step, keyCards } = action.payload;
      const stepData = selectedData[step] ?? {};
      keyCards.forEach((key) => {
        const cardData = stepData[key] ?? {
          selected: [],
          property: {},
        };
        cardData.selected = [key];
        stepData[key] = cardData;
      });
      state.selectedData[step] = stepData;
    },
    setDataCardsStep: (
      state,
      action: PayloadAction<{
        step: StepName;
        cards: Record<string, CardI>;
      }>
    ) => {
      const { step, cards } = action.payload;
      state.stepData[step] = {
        ...state.stepData[step],
        cards: cards,
      };
    },
    changeProcessInitData: (state, action: PayloadAction<boolean>) => {
      state.processInitData = action.payload;
    },
  },
});

export const {
  changeActiveStep,
  moveToStartStep,
  setLangText,
  addActiveCard,
  removeActiveCard,
  setActiveCardsForStep,
  changeProcessInitData,
  setPropertyItem,
  createItem,
  setDataCardsStep,
  removeActiveCards,
  addActiveCards,
} = uiSlice.actions;
export default uiSlice.reducer;
