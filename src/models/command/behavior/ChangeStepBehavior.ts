import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { getRoomAssetId } from "../../../utils/threekitUtils";
import { Application } from "../../Application";
import { AttributeI } from "../../configurator/type";
import { DataTable } from "../../dataTable/DataTable";
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
            app.eventEmitter.emit("threekitDataInitialized", configurator);
            app.eventEmitter.emit("processInitThreekitData", false);
            return resolve(true);
          });
      }
      // if (nextStep.key === StepName.ConferenceCamera) {
      //   const idDataTable2Level = getDataIdDataTable2Level(store);
      //   console.log("idDataTable2Level", idDataTable2Level);
      // }

      resolve(true);
    });
  }
}
