import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ConfiguratorStateI {
	isBuilding: boolean;
}

const initialState: ConfiguratorStateI = {
	isBuilding: false 
};

const configuratorSlice = createSlice({
  name: 'configurator',
  initialState,
  reducers: {
		changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
			state.isBuilding = action.payload
		}
  },
});

export const { changeStatusBuilding } = configuratorSlice.actions;
export default configuratorSlice.reducer;