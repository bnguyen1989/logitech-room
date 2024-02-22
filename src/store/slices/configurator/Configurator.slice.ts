import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Configuration } from "@threekit/rest-api";

interface ConfiguratorStateI {
  assetId: string | null;
  isBuilding: boolean;
  showDimensions: boolean;
  configuration: Configuration;
  nodes: Record<string, string>;
}

const initialState: ConfiguratorStateI = {
  assetId: null,
  isBuilding: true,
  showDimensions: false,
  configuration: {},
  nodes: {},
};

const configuratorSlice = createSlice({
  name: "configurator",
  initialState,
  reducers: {
    changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
      state.isBuilding = action.payload;
    },
    changeShowDimensions: (state, action: PayloadAction<boolean>) => {
      state.showDimensions = action.payload;
    },
    changeValueConfiguration: (
      state,
      action: PayloadAction<{
        key: string;
        value: Configuration;
      }>
    ) => {
      state.configuration[action.payload.key] = action.payload.value;
    },
    changeValueNodes: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.nodes = { ...state.nodes, ...action.payload };
    },
    changeAssetId: (state, action: PayloadAction<string>) => {
      state.assetId = action.payload;
    },
    removeNodes: (state, action: PayloadAction<string>) => {
      Object.keys(state.nodes).forEach((key) => {
        const value = state.nodes[key];
        if (value === action.payload) {
          delete state.nodes[key];
        }
      });
    },
    removeNodeByKeys: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((key) => {
        delete state.nodes[key];
      });
    },
  },
});

export const {
  changeStatusBuilding,
  changeShowDimensions,
  changeValueConfiguration,
  changeValueNodes,
  changeAssetId,
  removeNodes,
  removeNodeByKeys,
} = configuratorSlice.actions;
export default configuratorSlice.reducer;
