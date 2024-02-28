import { RootState } from '../../../'

export const getIsBuilding = (state: RootState) => state.configurator.isBuilding;

export const getShowDimensions = (state: RootState) => state.configurator.showDimensions;

export const getConfiguration = (state: RootState) => state.configurator.configuration;

export const getNodes = (state: RootState) => state.configurator.nodes;

export const getAssetId = (state: RootState) => state.configurator.assetId;

export const getIsProcessing = (state: RootState) => state.configurator.isProcessing;