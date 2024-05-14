import { RoomSizeName } from "./permissionUtils";

export const ConfigData = {
  host: "preview.threekit.com",
  orgId: "04015bb6-401d-47f8-97c0-dd6fa759c441",
  publicToken: "10d33d14-2cbb-4e98-8161-99225a65e298",
};

export const getRoomAssetId = (roomSize: string) => {
  switch (roomSize) {
    case RoomSizeName.Phonebooth:
      return "eaa5e5fb-05a4-4229-8a9c-73c136f0b407";
    case RoomSizeName.Huddle:
      return "39aeb563-84d7-4f32-96c8-2974bd2bb952";
    case RoomSizeName.Small:
      return "6931dca5-c102-44ad-91f4-97987edcb70b";
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
