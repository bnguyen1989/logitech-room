import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ModalI, ModalName } from './type';

interface ModalsStateI {
  [ModalName.MY_SETUP]: ModalI;
}

const initialState: ModalsStateI = {
  [ModalName.MY_SETUP]: {
    isOpen: false,
  },
};

const ModalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setMySetupModal: (state, action: PayloadAction<ModalI>) => {
			state[ModalName.MY_SETUP] = action.payload;
		}
  },
});

export const {
  setMySetupModal
} = ModalsSlice.actions;

export default ModalsSlice.reducer;