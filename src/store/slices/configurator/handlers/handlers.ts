import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ItemCardI } from "../../ui/type";
import { changeValueNodes } from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { isCamera, isMic, isTap } from '../../../../utils/permissionUtils'

declare const app: Application;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if(!activeStep) return;
      const card = activeStep.cards.find(
        (card: ItemCardI) => card.threekit?.assetId === data.asset.id
      );

      
      
      const isCameraCard = isCamera(card?.keyPermission);
      if(isCameraCard) {
        setCameraElement(data.asset.id)(store);
      }

      const isMicCard = isMic(card?.keyPermission);
      if(isMicCard) {
        setMicElement(data.asset.id)(store);
      }

      const isTapCard = isTap(card?.keyPermission);
      if(isTapCard) {
        setTapElement(data.asset.id)(store);
      }
    }
  });
};

function setCameraElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForCamera("Cabinet")]:
          assetId
      })
    );
  }
}

function setMicElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForMic(1)]: assetId,
      })
    );
  }
}

function setTapElement(assetId: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [Configurator.getNameNodeForTap(1)]: assetId,
      })
    );
  }
}
