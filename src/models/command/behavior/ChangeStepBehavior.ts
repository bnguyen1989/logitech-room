import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { getRoomAssetId } from "../../../utils/threekitUtils";
import { Application } from "../../Application";
import { AttributeI } from "../../configurator/type";
import { DataTable } from "../../dataTable/DataTable";
import { RestrictionHandler } from "../../handlers/RestrictionHandler";
import { Permission } from "../../permission/Permission";
import { StepName } from "../../permission/type";
import { ChangeStepCommand } from "../ChangeStepCommand";
import Behavior from "./Behavior";

declare const app: Application;
declare const permission: Permission;

export class ChangeStepBehavior extends Behavior {
  public async execute(command: ChangeStepCommand): Promise<boolean> {
    return new Promise((resolve) => {
      console.log("command", command);

      const activeElement = permission.getActiveItems()[0];
      if (command.stepName === StepName.Platform && activeElement) {
        const roomAssetId = getRoomAssetId(activeElement.name);
        app.currentConfigurator.assetId = roomAssetId;
        app.eventEmitter.emit("processInitThreekitData", true);
        return new ThreekitService()
          .getInitDataAssetById(roomAssetId)
          .then(({ attributes, dataTables, attributesSequenceLevel1 }) => {
            app.dataTableLevel1 = new DataTable(dataTables);
            app.currentConfigurator.attributesSequenceLevel1 =
              attributesSequenceLevel1;
            console.log("dataTables", dataTables);

            const configurator = app.currentConfigurator.getSnapshot();
            configurator.setAttributes(attributes as Array<AttributeI>);
            app.currentConfigurator = configurator;
            new RestrictionHandler(
              configurator,
              app.dataTableLevel1,
              app.dataTableLevel2
            ).handle();
            app.eventEmitter.emit("threekitDataInitialized", configurator);
            app.eventEmitter.emit("processInitThreekitData", false);
            return resolve(true);
          });
      }
      if (command.stepName === StepName.AudioExtensions) {
        const idDataTable2Level = new RestrictionHandler(
          app.currentConfigurator,
          app.dataTableLevel1,
          app.dataTableLevel2
        ).getIdLevel2DataTable();
        if (idDataTable2Level) {
          app.eventEmitter.emit("processInitThreekitData", true);
          return new ThreekitService()
            .getDataTablesById(idDataTable2Level)
            .then(({ dataTables }) => {
              app.dataTableLevel2 = new DataTable(dataTables);
              new RestrictionHandler(
                app.currentConfigurator,
                app.dataTableLevel1,
                app.dataTableLevel2
              ).handle();
              app.eventEmitter.emit("processInitThreekitData", false);
              return resolve(true);
            });
        }
        return resolve(true);
      }
      
      new RestrictionHandler(
        app.currentConfigurator,
        app.dataTableLevel1,
        app.dataTableLevel2
      ).handle();

      return resolve(true);
    });
  }
}
