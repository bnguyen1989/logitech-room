import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ModalI, ModalName, SelectProductModalI } from "./type";

interface ModalsStateI {
  [ModalName.MY_SETUP]: ModalI;
  [ModalName.ANNOTATION_ITEM]: ModalI;
  [ModalName.SELECT_PRODUCT]: SelectProductModalI;
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
};

const ModalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setMySetupModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.MY_SETUP] = action.payload;
    },
    setAnnotationItemModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.ANNOTATION_ITEM] = action.payload;
    },
    setSelectProductModal: (
      state,
      action: PayloadAction<SelectProductModalI>
    ) => {
      state[ModalName.SELECT_PRODUCT] = action.payload;
    },
  },
});

export const { setMySetupModal, setAnnotationItemModal, setSelectProductModal } =
  ModalsSlice.actions;

export default ModalsSlice.reducer;
