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
      return "2abd3c51-5f2f-4ddd-96f4-18b445cd80f4";
    default:
      return "2abd3c51-5f2f-4ddd-96f4-18b445cd80f4";
  }
};

export const isAssetType = (type: string) => {
  return type === "Asset";
};

export const isStringType = (type: string) => {
  return type === "String";
};
