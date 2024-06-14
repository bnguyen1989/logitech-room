import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import {
  DirectionStep,
  StepName,
  getArrayStepNames,
  getPrepareStepNames,
} from "../../../utils/baseUtils";
import { Application } from "../../Application";
import { Configurator } from "../../configurator/Configurator";
import { AttributeI } from "../../configurator/type";
import { DataTable } from "../../dataTable/DataTable";
import { ConfigurationConstraintHandler } from "../../handlers/ConfigurationConstraintHandler";
import { ChangeStepCommand } from "../ChangeStepCommand";
import Behavior from "./Behavior";

declare const app: Application;

export class ChangeStepBehavior extends Behavior {
  public async execute(command: ChangeStepCommand): Promise<boolean> {
    return new Promise((resolve) => {
      const dataTableAssetId = app.dataTableLevel1.assetId;
      const roomAssetId = app.currentConfigurator.assetId;
      const isLoadThreekitData =
        command.stepName === StepName.Platform &&
        dataTableAssetId !== roomAssetId;

      if (isLoadThreekitData) {
        const roomAssetId = app.currentConfigurator.assetId;
        app.eventEmitter.emit("processInitThreekitData", true);
        return new ThreekitService()
          .getInitDataAssetById(roomAssetId)
          .then(({ attributes, dataTables, attributesSequenceLevel1 }) => {
            app.dataTableLevel1 = new DataTable(dataTables).setAssetId(
              roomAssetId
            );
            app.currentConfigurator.attributesSequenceLevel1 =
              attributesSequenceLevel1;

            const configurator = app.currentConfigurator.getSnapshot();
            configurator.setAttributes(attributes as Array<AttributeI>);
            app.currentConfigurator = configurator;
            ConfigurationConstraintHandler.clearCacheData();
            return new ConfigurationConstraintHandler(
              configurator,
              app.dataTableLevel1,
              app.dataTableLevel2
            )
              .handle()
              .then(() => {
                app.eventEmitter.emit("threekitDataInitialized", configurator);
                app.eventEmitter.emit("processInitThreekitData", false);
                return resolve(true);
              });
          });
      }

      const prepareStepNames = getPrepareStepNames();
      if (
        command.direction === DirectionStep.Prev &&
        prepareStepNames.includes(command.stepName)
      ) {
        const arrayStepName = getArrayStepNames();
        const index = arrayStepName.indexOf(command.stepName);
        arrayStepName.forEach((stepName, i) => {
          if (i <= index) return;
          const attributesStep = Configurator.getNamesAttrByStepName(stepName);
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
      }

      return new ConfigurationConstraintHandler(
        app.currentConfigurator,
        app.dataTableLevel1,
        app.dataTableLevel2
      )
        .handle()
        .then(() => {
          return resolve(true);
        });
    });
  }
}
