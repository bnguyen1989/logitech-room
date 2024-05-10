import { RootState } from "../../../";

export const getIsBuilding = (state: RootState) =>
  state.configurator.isBuilding;

export const getShowDimensions = (state: RootState) =>
  state.configurator.showDimensions;

export const getConfiguration = (state: RootState) =>
  state.configurator.configuration;

export const getNodes = (state: RootState) => state.configurator.nodes;

export const getAssetIdByNameNode =
  (nameNode: string) => (state: RootState) => {
    const nodes = getNodes(state);
    return nodes[nameNode];
  };

export const getAssetId = (state: RootState) => state.configurator.assetId;

export const getIsProcessing = (state: RootState) =>
  state.configurator.isProcessing;

export const getHighlightNodes = (state: RootState) =>
  state.configurator.highlightNodes;

export const getIsHighlightNode = (nameNode: string) => (state: RootState) => {
  const highlightNodes = getHighlightNodes(state);
  return Object.entries(highlightNodes).some(([key, value]) => {
    if (!nameNode.includes(key)) return false;
    return value;
  });
};
