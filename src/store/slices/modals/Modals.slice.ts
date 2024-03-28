import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ModalI, ModalName } from "./type";

interface ModalsStateI {
  [ModalName.MY_SETUP]: ModalI;
  [ModalName.INFO_ITEM]: ModalI;
  [ModalName.SELECT_PRODUCT]: ModalI;
}

const initialState: ModalsStateI = {
  [ModalName.MY_SETUP]: {
    isOpen: false,
  },
  [ModalName.INFO_ITEM]: {
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
    setInfoItemModal: (state, action: PayloadAction<ModalI>) => {
  
      state[ModalName.INFO_ITEM] = action.payload;
    },
    setSelectProductModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.SELECT_PRODUCT] = action.payload;
    },
  },
});

export const { setMySetupModal, setInfoItemModal, setSelectProductModal } =
  ModalsSlice.actions;

export default ModalsSlice.reducer;
