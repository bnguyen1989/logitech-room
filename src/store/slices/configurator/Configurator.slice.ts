import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Configuration } from '@threekit/rest-api';

interface ConfiguratorStateI {
	isBuilding: boolean;
	showDimensions: boolean;
	configuration: Configuration;
	nodes: Record<string, string>;
}

const initialState: ConfiguratorStateI = {
	isBuilding: false,
	showDimensions: false, 
	configuration: {},
	nodes: {}
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
		},
		changeValueNodes: (state, action: PayloadAction<Record<string, string>>) => {
			state.nodes = {...state.nodes, ...action.payload}
		}
  },
});

export const { changeStatusBuilding, changeShowDimensions, changeValueConfiguration, changeValueNodes } = configuratorSlice.actions;
export default configuratorSlice.reducer;