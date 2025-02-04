import { DimensionService } from "../../../services/DimensionService/DimensionService";
import { Application } from "../../Application";
import Behavior from "./Behavior";

declare const app: Application;

export class DimensionRoomBehavior extends Behavior {
  public async execute(): Promise<boolean> {
    return new Promise((resolve) => {
      const isNeedToLoadDimension = app.dimensionDataTable.isEmpty();

      if (isNeedToLoadDimension) {
        app.eventEmitter.emit("processInitThreekitData", true);
        return new DimensionService().getDimensionTable().then((data) => {
          app.dimensionDataTable = data;

          app.eventEmitter.emit("processInitThreekitData", false);
          return resolve(true);
        });
      }
      return resolve(true);
    });
  }
}
