import { RootState } from "../../../";
import { DataCamera } from "../../../../models/R3F";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { CountableMountElement } from "../../../../models/permission/elements/mounts/CountableMountElement";
import { MountElement } from "../../../../models/permission/elements/mounts/MountElement";
import { StepName } from "../../../../utils/baseUtils";
import {
  getPermission,
  getPropertyCounterCardByKeyPermission,
} from "../../ui/selectors/selectors";
import { CardI } from "../../ui/type";

export const getIsBuilding = (state: RootState) =>
  state.configurator.isBuilding;

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
export const getPopuptNodes = (state: RootState) =>
  state.configurator.popuptNodes;
export const getDataCamera = (state: RootState): DataCamera => {
  const dataCamera: any = state.configurator.camera;

  return dataCamera;
};

export const getIsHighlightNode = (nameNode: string) => (state: RootState) => {
  const highlightNodes = getHighlightNodes(state);
  return Object.entries(highlightNodes).some(([key, value]) => {
    if (!nameNode.includes(key)) return false;
    return value;
  });
};
export const getIsPopuptNodes = (nameNode: string) => (state: RootState) => {
  const highlightNodes = getPopuptNodes(state);
  return Object.entries(highlightNodes).some(([key, value]) => {
    if (!nameNode.includes(key)) return false;
    return value;
  });
};

export const getKeyPermissionFromNameNode =
  (nameNode: string) =>
  (state: RootState): { [key in StepName]?: string[] } | undefined => {
    let objKeyPermission: { [key in StepName]?: string[] } | undefined =
      undefined;
    const permission = getPermission()(state);
    const permissionSteps = permission.getSteps();

    permissionSteps.forEach((step) => {
      if (objKeyPermission !== undefined) return;
      const stepActiveElements = step.getActiveElements();
      stepActiveElements.forEach((element) => {
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
              objKeyPermission = {
                [step["name"]]: [itemElement.name, element.name],
              };
            }
          }
        } else if (element instanceof ItemElement) {
          const defaultMount = element.getDefaultMount();

          if (defaultMount instanceof CountableMountElement) {
            const allCountableNames = defaultMount.getAvailableNameNode();
            if (allCountableNames.includes(nameNode)) {
              objKeyPermission = {
                [step["name"]]: [element.name],
              };
            }
            return;
          }

          if (!(defaultMount instanceof MountElement)) return;

          const listItems: string[] = [element.name];
          element.getAccessoryItems().forEach((ac) => {
            const isActiveAccessory = step.isActiveElement(ac);
            if (isActiveAccessory) {
              listItems.push(ac);
            }
          });

          const nodeName = defaultMount.getNameNode();
          if (nodeName === nameNode) {
            objKeyPermission = {
              [step["name"]]: listItems,
            };
          }
        }
      });
    });

    return objKeyPermission;
  };

export const isMountedCard =
  (card: CardI, stepName: StepName) => (assetId: string) => {
    return (state: RootState) => {
      const permission = getPermission(stepName)(state);
      const stepData = permission.getStepByName(stepName);
      const count = getPropertyCounterCardByKeyPermission(
        stepName,
        card.keyPermission
      )(state);

      const nodes = getNodes(state);
      const keys = Object.keys(nodes);
      const keyNodes = keys.filter((key) => nodes[key] === assetId);

      const item = stepData.getElementByName(card.keyPermission);
      const isMountedCard =
        item instanceof ItemElement &&
        item
          .getAccessoryItems()
          .map((ac) => {
            const acItem = stepData.getElementByName(ac);
            if (!(acItem instanceof ItemElement)) return;
            const defaultMount = acItem.getDefaultMount();
            if (!(defaultMount instanceof CountableMountElement)) return;
            return defaultMount.getRangeNameNode();
          })
          .flat()
          .filter((nameNode) => nameNode && keys.includes(nameNode)).length ===
          count;

      const keylength = keyNodes.length;
      return (
        keylength &&
        (count === undefined ||
          count === keylength ||
          (isMountedCard && keylength === 1))
      );
    };
  };
