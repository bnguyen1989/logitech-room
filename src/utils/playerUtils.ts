import { RoomSizeName } from "./permissionUtils";

export const getDistanceDataByKeyPermission = (keyPermission: string) => {
  switch (keyPermission) {
    case RoomSizeName.Phonebooth:
      return { minDistance: 35, maxDistance: 60 };
    case RoomSizeName.Huddle:
      return { minDistance: 40, maxDistance: 70 };
    case RoomSizeName.Small:
      return { minDistance: 40, maxDistance: 80 };
    case RoomSizeName.Medium:
    case RoomSizeName.Large:
    case RoomSizeName.Auditorium:
      return { minDistance: 60, maxDistance: 150 };
    default:
      return { minDistance: 60, maxDistance: 150 };
  }
};
