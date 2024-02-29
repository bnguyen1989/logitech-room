import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ItemCardI, StepCardType } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueNodes,
  removeNodeByKeys,
  removeNodes,
} from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { isCamera, isMic, isScribe, isTap } from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import { Permission } from "../../../../models/permission/Permission";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { StepName } from "../../../../models/permission/type";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";

declare const app: Application;
declare const permission: Permission;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (!activeStep) return;
      const card = activeStep.cards.find(
        (card: ItemCardI) => card.threekit?.assetId === data.assetId
      );

      const isCameraCard = isCamera(card?.keyPermission);
      if (isCameraCard) {
        setCameraElement(data.assetId)(store);
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

      if (isCameraCard || isMicCard || isTapCard) {
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
    if (index !== -1) {
      const card = activeStep.cards[index];
      console.log("element", card);

      permission.removeActiveItemByName(card.keyPermission);
      store.dispatch(removeNodes(assetId));
    }
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
