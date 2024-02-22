import { Application } from "../models/Application";
import { AttributeI } from "../models/configurator/type";
import { ThreekitService } from "../services/Threekit/ThreekitService";
import { RoomSizeName } from './permissionUtils'

declare const app: Application;

export const ConfigData = {
  host: "preview.threekit.com",
  orgId: "04015bb6-401d-47f8-97c0-dd6fa759c441",
  publicToken: "b107f4dd-51d7-48f7-8fa3-c76dcf663f8a",
  assetId: "32ba8c20-d54a-46d2-a0bb-0339c71e7dc6",
};

export const initThreekitData = async () => {
  const assetId = app.currentConfigurator.assetId;
  app.eventEmitter.emit("processInitThreekitData", true);
  new ThreekitService().getInitDataAssetById(assetId).then(({
    attributes,
    dataTables
  }) => {
    console.log("dataTables", dataTables);
    
    const configurator = app.currentConfigurator.getSnapshot();
    configurator.setAttributes(attributes as Array<AttributeI>);
    app.currentConfigurator = configurator;
    app.eventEmitter.emit("threekitDataInitialized", {
      configurator,
      dataTables
    });
    app.eventEmitter.emit("processInitThreekitData", false);
  });
};

export const getRoomAssetId = (roomSize: string) => {
  switch(roomSize) {
    case RoomSizeName.Medium:
      return "78413aac-16a7-473a-b0bd-2741655ed43f";
    default:
      return "78413aac-16a7-473a-b0bd-2741655ed43f";
  }
};

export const isAssetType = (type: string) => {
  return type === "Asset";
};

export const isStringType = (type: string) => {
	return type === "String";
}
