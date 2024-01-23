import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ModalI, ModalName } from './type';

interface ModalsStateI {
  [ModalName.MY_SETUP]: ModalI;
  [ModalName.INFO_ITEM]: ModalI;
}

const initialState: ModalsStateI = {
  [ModalName.MY_SETUP]: {
    isOpen: false,
  },
  [ModalName.INFO_ITEM]: {
    isOpen: false,
  },
};

const ModalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setMySetupModal: (state, action: PayloadAction<ModalI>) => {
			state[ModalName.MY_SETUP] = action.payload;
		},
    setInfoItemModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.INFO_ITEM] = action.payload;
    }
  },
});

export const {
  setMySetupModal,
  setInfoItemModal,
} = ModalsSlice.actions;

export default ModalsSlice.reducer;