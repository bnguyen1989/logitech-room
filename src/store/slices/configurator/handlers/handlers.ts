import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { BaseCardI, ItemCardI, StepCardType } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueNodes,
  removeNodeByKeys,
  removeNodes,
} from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import {
  isCamera,
  isCameraMount,
  isMic,
  isScribe,
  isTap,
  isTapMount,
} from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import { Permission } from "../../../../models/permission/Permission";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { StepName } from "../../../../models/permission/type";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { MountElement } from "../../../../models/permission/elements/MountElement";

declare const app: Application;
declare const permission: Permission;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (!activeStep) return;
      const card: BaseCardI | undefined = activeStep.cards.find(
        (card: BaseCardI) => card.threekit?.assetId === data.assetId
      );

      if (!card || !card.keyPermission) return;
      const step = permission.getCurrentStep();

      if (!step || !card.threekit) return;

      const element = step.getElementByName(card.keyPermission);

      if (element instanceof ItemElement) {
        const defaultMount = element.getDefaultMount();
        if (defaultMount && card.threekit) {
          setElementByNameNode(
            card.threekit.assetId,
            defaultMount.nodeName
          )(store);
        }
      } else if (element instanceof MountElement) {
        const itemElement = step.getItemElementByMountName(element.name);
        const cardItemElement = activeStep.cards.find(
          (card: ItemCardI) => card.keyPermission === itemElement?.name
        );
        if (cardItemElement && cardItemElement.threekit) {
          store.dispatch(removeNodes(cardItemElement.threekit.assetId));
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(
            cardItemElement.threekit.assetId,
            element.nodeName
          )(store);
        }
      }

      const isScribeCard = isScribe(card?.keyPermission);
      if (isScribeCard) {
        setCameraElement(data.assetId)(store);
      }

      const isMicCard = isMic(card?.keyPermission);
      if (isMicCard) {
        setMicElement(data.assetId)(store);
      }

      const isTapCard = isTap(card?.keyPermission);
      if (isTapCard) {
        setTapElement(data.assetId)(store);
      }

      if (isMicCard || isTapCard) {
        store.dispatch(changeStatusProcessing(true));
      }
    }

    if (data instanceof RemoveItemCommand) {
      removeElement(data.assetId)(store);
    }

    if (data instanceof ChangeCountItemCommand) {
      const value = parseInt(data.value);
      changeCountElement(data.assetId, value)(store);
    }

    if (data instanceof ChangeStepCommand) {
      const configurator = app.currentConfigurator;
      const updateNodes = updateNodesByConfiguration(
        configurator,
        data.stepName
      );

      if (data.stepName === StepName.Platform) {
        updateNodes(store, Configurator.PlatformName);
      }
      if (data.stepName === StepName.Services) {
        updateNodes(store, Configurator.ServicesName);
      }
      if (data.stepName === StepName.AudioExtensions) {
        updateNodes(store, Configurator.AudioExtensionName);
      }
      if (data.stepName === StepName.ConferenceCamera) {
        updateNodes(store, Configurator.CameraName);
      }
      if (data.stepName === StepName.MeetingController) {
        updateNodes(store, Configurator.MeetingControllerName);
      }
      if (data.stepName === StepName.VideoAccessories) {
        updateNodes(store, Configurator.VideoAccessoriesName);
      }
    }
  });
};

function getAssetIdByNameNodes(arrayNodes: Array<string>) {
  return (store: Store) => {
    const nodes = store.getState().configurator.nodes;
    for (const item of arrayNodes) {
      if (nodes[item]) {
        return nodes[item];
      }
    }
  };
}

function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const configuration = configurator.getConfiguration();
    const cards: Array<StepCardType> =
      store.getState().ui.stepData[stepName].cards;
    const nodes = store.getState().configurator.nodes;
    arrayAttributes.forEach((item) => {
      const [name, qtyName] = item;
      const value = configuration[name];

      if (!(typeof value === "object")) return;

      const tempCard = cards.find(
        (item) =>
          item.key !== StepName.RoomSize &&
          item.threekit?.assetId === value.assetId
      );

      if (!tempCard || !tempCard.keyPermission) {
        return;
      }

      const isCameraCard = isCamera(tempCard.keyPermission);
      const isMicCard = isMic(tempCard.keyPermission);
      const isTapCard = isTap(tempCard.keyPermission);
      if (isCameraCard) {
        const assetId = nodes[Configurator.getNameNodeForCamera("Cabinet")];
        if (assetId !== value.assetId) {
          setCameraElement(value.assetId)(store);
        }
      }

      if (qtyName && "counter" && (isMicCard || isTapCard)) {
        const qty = configuration[qtyName];
        if (typeof qty === "string") {
          const currentValue = parseInt(qty);
          changeCountElement(value.assetId, currentValue)(store);
        }
      }
    });
  };
}

function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,
      })
    );
  };
}

function setCameraElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForCamera("Cabinet")]: assetId,
      })
    );
  };
}

function setMicElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForMic(1)]: assetId,
      })
    );
  };
}

function setTapElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForTap(1)]: assetId,
      })
    );
  };
}

function removeElement(assetId: string) {
  return (store: Store) => {
    const activeStep = store.getState().ui.activeStep;
    if (!activeStep) return;
    const index = activeStep.cards.findIndex(
      (item: ItemCardI) => item.threekit?.assetId === assetId
    );
    if (index === -1) return;

    const card = activeStep.cards[index];
    permission.removeActiveItemByName(card.keyPermission);

    const isCameraMountCard = isCameraMount(card?.keyPermission);
    const isTapMountCard = isTapMount(card?.keyPermission);
    if (isCameraMountCard || isTapMountCard) {
      let nodes = [
        Configurator.getNameNodeForCamera("Cabinet"),
        Configurator.getNameNodeForCamera("Wall", 1),
        Configurator.getNameNodeForCamera("Wall", 2),
      ];
      if (isTapMountCard) {
        nodes = [
          Configurator.getNameNodeForTap(1),
          Configurator.getNameNodeForTap(2),
          Configurator.getNameNodeForTap(3),
        ];
      }
      const assetId = getAssetIdByNameNodes(nodes)(store);
      if (assetId) {
        store.dispatch(removeNodes(assetId));
        if (isCameraMountCard) {
          setCameraElement(assetId)(store);
        } else {
          setTapElement(assetId)(store);
        }
      }
      return;
    }

    store.dispatch(removeNodes(assetId));
  };
}

function changeCountElement(assetId: string, value: number) {
  return (store: Store) => {
    const activeStep = store.getState().ui.activeStep;
    if (!activeStep) return;
    const card = activeStep.cards.find(
      (card: ItemCardI) => card.threekit?.assetId === assetId
    );
    if (value === 0) {
      permission.removeActiveItemByName(card.keyPermission);
      store.dispatch(removeNodes(assetId));
      return;
    }
    const nodes = store.getState().configurator.nodes;
    const keysNode = Object.keys(nodes).filter((key) => nodes[key] === assetId);

    if (keysNode.length > value) {
      const deleteKeys = keysNode.slice(value);
      store.dispatch(removeNodeByKeys(deleteKeys));
    }

    const isMicCard = isMic(card?.keyPermission);
    const isTapCard = isTap(card?.keyPermission);
    let objectNodes = {};
    for (let index = 1; index <= value; index++) {
      if (isMicCard) {
        objectNodes = {
          ...objectNodes,
          [Configurator.getNameNodeForMic(index)]: assetId,
        };
      }
      if (isTapCard) {
        objectNodes = {
          ...objectNodes,
          [Configurator.getNameNodeForTap(index)]: assetId,
        };
      }
    }
    store.dispatch(changeValueNodes(objectNodes));
  };
}
