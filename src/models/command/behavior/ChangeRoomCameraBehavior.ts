import { getArrayStepNames, StepName } from "../../../utils/baseUtils";
import { Application } from "../../Application";
import { Configurator } from "../../configurator/Configurator";
import { AttributeName } from "../../configurator/type";
import { SelectProductModal } from "../../modals/SelectProductModal";
import { AddItemCommand } from "../AddItemCommand";
import Behavior from "./Behavior";

declare const app: Application;

export class ChangeRoomCameraBehavior extends Behavior {
  public async execute(command: AddItemCommand): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (command.nameProperty === AttributeName.RoomCamera) {
        new SelectProductModal(
          command.nameProperty,
          () => {
            const arrayStepName = getArrayStepNames();
            const index = arrayStepName.indexOf(StepName.ConferenceCamera);
            arrayStepName.forEach((stepName, i) => {
              if (i <= index) return;
              const attributesStep =
                Configurator.getNamesAttrByStepName(stepName);
              const objects: Record<string, any> = {};
              attributesStep.forEach((attr) => {
                const { 0: attrName, 1: qtyName } = attr;
                if (attrName) {
                  objects[attrName] = {
                    assetId: "",
                  };
                }
                if (qtyName) {
                  objects[qtyName] = "0";
                }
              });
              app.currentConfigurator.setConfiguration(objects);
            });
            return resolve(true);
          },
          () => {
            return resolve(false);
          },
          () => {
            return resolve(true);
          }
        ).show();
      } else {
        return resolve(true);
      }
    });
  }
}
