import { RoomSizeName } from "./permissionUtils";

export const ConfigData = {
  host: "preview.threekit.com",
  orgId: "04015bb6-401d-47f8-97c0-dd6fa759c441",
  publicToken: "53d0dbf1-6aba-41e1-98f8-629d1817c765",
  userId: "07c14cbe-80a2-431b-bf1c-6bdbc4c1697d",
};

export const getRoomAssetId = (roomSize: string) => {
  switch (roomSize) {
    case RoomSizeName.Medium:
      return "3bb4f42a-939d-4392-b073-f6e333c50a06";
    default:
      return "3bb4f42a-939d-4392-b073-f6e333c50a06";
  }
};

export const isAssetType = (type: string) => {
  return type === "Asset";
};

export const isStringType = (type: string) => {
  return type === "String";
};
