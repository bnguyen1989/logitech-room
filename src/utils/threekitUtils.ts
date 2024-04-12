import { RoomSizeName } from "./permissionUtils";

export const ConfigData = {
  host: "preview.threekit.com",
  orgId: "04015bb6-401d-47f8-97c0-dd6fa759c441",
  publicToken: "69da68c5-a63b-4c58-9607-6beb1ef1cffa",
  userId: "07c14cbe-80a2-431b-bf1c-6bdbc4c1697d",
};

export const getRoomAssetId = (roomSize: string) => {
  switch (roomSize) {
    case RoomSizeName.Phonebooth:
      return "e7e4571a-a660-4e06-9c4b-1a6789b02b4a";
    case RoomSizeName.Huddle:
      return "75974943-19ab-4185-a672-61f64c4c4402";
    case RoomSizeName.Small:
      return "52dca6aa-c23b-464f-b384-507224c9bf7f";
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
