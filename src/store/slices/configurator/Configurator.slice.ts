import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Configuration } from "@threekit/rest-api";
import { DataCamera, CameraData } from "../../../models/R3F";

interface ConfiguratorStateI {
  assetId: string | null;
  isBuilding: boolean;
  isProcessing: boolean;
  configuration: Record<string, Configuration>;
  nodes: Record<string, string>;
  highlightNodes: Record<string, boolean>;
  popuptNodes: Record<string, boolean>;
  camera: DataCamera;
}

const initialState: ConfiguratorStateI = {
  assetId: null,
  isBuilding: true,
  isProcessing: false,
  configuration: {},
  nodes: {},
  highlightNodes: {},
  popuptNodes: {},
  camera: CameraData,
};

const configuratorSlice = createSlice({
  name: "configurator",
  initialState,
  reducers: {
    changeStatusBuilding: (state, action: PayloadAction<boolean>) => {
      state.isBuilding = action.payload;
    },
    changeValueConfiguration: (
      state,
      action: PayloadAction<{
        key: string;
        value: Configuration;
      }>
    ) => {
      const { key, value } = action.payload;
      state.configuration = {
        ...state.configuration,
        [key]: { ...value },
      };
    },
    removeValuesConfigurationByKeys: (
      state,
      action: PayloadAction<string[]>
    ) => {
      action.payload.forEach((key) => {
        delete state.configuration[key];
      });
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
    changeStatusProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setHighlightNodes: (
      state,
      action: PayloadAction<Record<string, boolean>>
    ) => {
      state.highlightNodes = action.payload;
    },
    setPopuptNodes: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.popuptNodes = action.payload;
    },
    setDataCamera: (state, action: PayloadAction<DataCamera>) => {
      state.camera = action.payload;
    },
    disabledHighlightNode: (state, action: PayloadAction<string>) => {
      Object.keys(state.highlightNodes).forEach((key) => {
        if (action.payload.includes(key)) {
          state.highlightNodes[key] = false;
        }
      });
    },
    removeHighlightNodesByKeys: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((key) => {
        delete state.highlightNodes[key];
      });
    },
    disabledPopuptNodes: (state, action: PayloadAction<string>) => {
      Object.keys(state.popuptNodes).forEach((key) => {
        if (action.payload.includes(key)) {
          state.popuptNodes[key] = false;
        }
      });
    },
  },
});

export const {
  setDataCamera,
  changeStatusBuilding,
  changeValueConfiguration,
  removeValuesConfigurationByKeys,
  changeValueNodes,
  changeAssetId,
  removeNodes,
  removeNodeByKeys,
  changeStatusProcessing,
  setHighlightNodes,
  disabledHighlightNode,
  removeHighlightNodesByKeys,
  setPopuptNodes,
  disabledPopuptNodes,
} = configuratorSlice.actions;
export default configuratorSlice.reducer;
