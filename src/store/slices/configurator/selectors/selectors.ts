import { RootState } from "../../../";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { MountElement } from "../../../../models/permission/elements/mounts/MountElement";
import { StepName } from "../../../../utils/baseUtils";
import {
  getCardByKeyPermission,
  getPermission,
} from "../../ui/selectors/selectors";

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

export const getKeyPermissionFromNameNode =
  (nameNode: string) =>
  (state: RootState): { [key in StepName]?: string } | undefined => {

    let objKeyPermission: { [key in StepName]?: string } | undefined = undefined;
    const permission = getPermission()(state);
    const permissionSteps = permission.getSteps();

    permissionSteps.forEach((step) => {
      if (objKeyPermission !== undefined) return;
      const stepCurentElements = step.getActiveElements();
      stepCurentElements.forEach((element) => {
        if (objKeyPermission !== undefined) return;
        if (element instanceof MountElement) {
          const nodeName = element.getNameNode();
          const dependentMount = element.getDependentMount();
          const dependentNodeName = dependentMount?.getNameNode();
          if (nodeName === nameNode || dependentNodeName === nameNode) {
            const itemElement = step.getActiveItemElementByMountName(
              element.name
            );
            if (itemElement instanceof ItemElement) {
              const card = getCardByKeyPermission(
                step["name"],
                itemElement.name
              )(state);
              objKeyPermission = {
                [step["name"]]: card.keyPermission,
              };
            }
          }
        } else if (element instanceof ItemElement) {
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof MountElement)) return;
          const nodeName = defaultMount.getNameNode();
          if (nodeName === nameNode) {
            const card = getCardByKeyPermission(
              step["name"],
              element.name
            )(state);
            objKeyPermission = {
              [step["name"]]: card.keyPermission,
            };
          }
        }
      });
    });

    return objKeyPermission;
  };
