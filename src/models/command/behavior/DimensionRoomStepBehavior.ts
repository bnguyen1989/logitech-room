import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { StepName } from "../../../utils/baseUtils";
import { getDimensionTableId } from "../../../utils/threekitUtils";
import { Application } from "../../Application";
import { DataTable } from "../../dataTable/DataTable";
import { ChangeStepCommand } from "../ChangeStepCommand";
import Behavior from "./Behavior";

declare const app: Application;

export class DimensionRoomStepBehavior extends Behavior {
  public async execute(command: ChangeStepCommand): Promise<boolean> {
    return new Promise((resolve) => {
      const isNeedToLoadDimension =
        command.stepName === StepName.Platform &&
        app.dimensionDataTable.isEmpty();

      if (isNeedToLoadDimension) {
        const id = getDimensionTableId();
        return new ThreekitService().getDataTablesById(id).then((data) => {
          app.dimensionDataTable = new DataTable(data).setAssetId(id);

          return resolve(true);
        });
      }
      return resolve(true);
    });
  }
}
