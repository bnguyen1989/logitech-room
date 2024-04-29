import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  AnnotationItemModalI,
  ModalI,
  ModalName,
  SelectProductModalI,
} from "./type";

interface ModalsStateI {
  [ModalName.MY_SETUP]: ModalI;
  [ModalName.ANNOTATION_ITEM]: AnnotationItemModalI;
  [ModalName.SELECT_PRODUCT]: SelectProductModalI;
  [ModalName.SHARE_PROJECT]: ModalI;
  [ModalName.FINISH]: ModalI;
}

const initialState: ModalsStateI = {
  [ModalName.MY_SETUP]: {
    isOpen: false,
  },
  [ModalName.ANNOTATION_ITEM]: {
    isOpen: false,
  },
  [ModalName.SELECT_PRODUCT]: {
    isOpen: false,
  },
  [ModalName.SHARE_PROJECT]: {
    isOpen: false,
  },
  [ModalName.FINISH]: {
    isOpen: false,
  },
};

const ModalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setMySetupModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.MY_SETUP] = action.payload;
    },
    setAnnotationItemModal: (
      state,
      action: PayloadAction<AnnotationItemModalI>
    ) => {
      state[ModalName.ANNOTATION_ITEM] = action.payload;
    },
    setSelectProductModal: (
      state,
      action: PayloadAction<SelectProductModalI>
    ) => {
      state[ModalName.SELECT_PRODUCT] = action.payload;
    },
    setShareProjectModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.SHARE_PROJECT] = action.payload;
    },
    setFinishModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.FINISH] = action.payload;
    },
  },
});

export const {
  setMySetupModal,
  setAnnotationItemModal,
  setSelectProductModal,
  setShareProjectModal,
  setFinishModal,
} = ModalsSlice.actions;

export default ModalsSlice.reducer;
