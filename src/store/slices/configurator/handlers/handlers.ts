import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ItemCardI } from "../../ui/type";
import { changeValueNodes, removeNodeByKeys, removeNodes } from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { isCamera, isMic, isTap } from "../../../../utils/permissionUtils";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import { Permission } from "../../../../models/permission/Permission";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";

declare const app: Application;
declare const permission: Permission;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (!activeStep) return;
      const card = activeStep.cards.find(
        (card: ItemCardI) => card.threekit?.assetId === data.asset.id
      );

      const isCameraCard = isCamera(card?.keyPermission);
      if (isCameraCard) {
        setCameraElement(data.asset.id)(store);
      }

      const isMicCard = isMic(card?.keyPermission);
      if (isMicCard) {
        setMicElement(data.asset.id)(store);
      }

      const isTapCard = isTap(card?.keyPermission);
      if (isTapCard) {
        setTapElement(data.asset.id)(store);
      }
    }

    if (data instanceof RemoveItemCommand) {
      removeElement(data.assetId)(store);
    }

    if (data instanceof ChangeCountItemCommand) {
      const value = parseInt(data.value);
      changeCountElement(data.assetId, value)(store);
    }
  });
};

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
      console.log('element', card);
      
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

    if(keysNode.length > value) {
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
      if(isTapCard) {
        objectNodes = {
          ...objectNodes,
          [Configurator.getNameNodeForTap(index)]: assetId
        }
      }
    }
    store.dispatch(changeValueNodes(objectNodes));
  };
}
