import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ConfiguratorStateI {
	isBuilding: boolean;
	showDimensions: boolean;
}

const initialState: ConfiguratorStateI = {
	isBuilding: false,
	showDimensions: false, 
};

const configuratorSlice = createSlice({
  name: 'configurator',
  initialState,
  reducers: {
		changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
			state.isBuilding = action.payload
		},
		changeShowDimensions: (state, action: PayloadAction<boolean>) => {
			state.showDimensions = action.payload
		}
  },
});

export const { changeStatusBuilding, changeShowDimensions } = configuratorSlice.actions;
export default configuratorSlice.reducer;