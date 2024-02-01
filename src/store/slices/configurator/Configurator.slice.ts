import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Configuration } from '@threekit/rest-api';

interface ConfiguratorStateI {
	isBuilding: boolean;
	showDimensions: boolean;
	configuration: Configuration;
}

const initialState: ConfiguratorStateI = {
	isBuilding: false,
	showDimensions: false, 
	configuration: {},
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
		},
		changeValueConfiguration: (state, action: PayloadAction<{
			key: string,
			value: Configuration
		}>) => {
			state.configuration[action.payload.key] = action.payload.value
		}
  },
});

export const { changeStatusBuilding, changeShowDimensions, changeValueConfiguration } = configuratorSlice.actions;
export default configuratorSlice.reducer;