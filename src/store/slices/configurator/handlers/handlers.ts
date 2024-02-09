import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { ItemCardI } from "../../ui/type";
import {
  AudioExtensionName,
  CameraName,
  MeetingControllerName,
} from "../../../../models/permission/data";
import { changeValueNodes } from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";

declare const app: Application;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (activeStep) {
        const card = activeStep.cards.find(
          (card: ItemCardI) => card.threekit?.assetId === data.asset.id
        );
        const isCamera = [
         //  CameraName.RallyBar,
          CameraName.RallyBarMini,
        ].includes(card?.keyPermission);
        if (isCamera) {
          store.dispatch(
            changeValueNodes({
              [Configurator.getNameNodeForCamera("Cabinet")]:
                data.asset.id,
            })
          );
        }
        const isMic = [AudioExtensionName.RallyMicPod].includes(
          card?.keyPermission
        );
        if (isMic) {
          store.dispatch(
            changeValueNodes({
              [Configurator.getNameNodeForMic(1)]: data.asset.id,
            })
          );
        }

        const isTap = [MeetingControllerName.LogitechTapIP, MeetingControllerName.LogitechTap].includes(card?.keyPermission);
        if (isTap) {
          store.dispatch(
            changeValueNodes({
              [Configurator.getNameNodeForTap(1)]: data.asset.id,
            })
          );
        }
      }
    }
  });
};
