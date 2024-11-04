import { RoomSizeName, SoftwareServicesName } from "./permissionUtils";

export const ConfigData = {
  host: "admin-fts.threekit.com",
  orgId: "98900460-52bb-4de1-bf91-02e3ea8c2d87",
  publicToken: "d57c7f88-1a28-462f-ba7b-14c22c14a8f9",
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
    case RoomSizeName.Large:
      return "82d8aa99-b8a5-43a7-8f75-b2fa9550c582";
    case RoomSizeName.Auditorium:
      return "42fb08de-e0d8-4456-a246-e105e1bb1d5b";
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

export const getPriceTableIdBySoftwareService = (service: string) => {
  switch (service) {
    case SoftwareServicesName.ExtendedWarranty:
      return "f3d2c17e-db6d-49f4-a123-c91bd6c5b0bb";
    case SoftwareServicesName.EssentialServicePlan:
      return "e89e54fc-0b9d-4a35-b353-7ce76a66d731";
    case SoftwareServicesName.SupportService:
      return "e2130a33-3505-4bb2-b878-d982c71e8195";
    default:
      return null;
  }
};
