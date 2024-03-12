import { RoomSizeName } from "./permissionUtils";

export const ConfigData = {
  host: "preview.threekit.com",
  orgId: "04015bb6-401d-47f8-97c0-dd6fa759c441",
  publicToken: "c79cb2fd-9fcf-4d61-bbed-6dc90b76a4f3",
  userId: "07c14cbe-80a2-431b-bf1c-5bdbc4c1687d",
};

export const getRoomAssetId = (roomSize: string) => {
  switch (roomSize) {
    case RoomSizeName.Medium:
      return "f859d9d2-dbea-408f-87ed-9c17c959f452";
    default:
      return "f859d9d2-dbea-408f-87ed-9c17c959f452";
  }
};

export const isAssetType = (type: string) => {
  return type === "Asset";
};

export const isStringType = (type: string) => {
  return type === "String";
};
