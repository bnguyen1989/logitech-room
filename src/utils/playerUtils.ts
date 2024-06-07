import { Vector3 } from "three";
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
      return { minDistance: 50, maxDistance: 150 };
    case RoomSizeName.Large:
      return { minDistance: 50, maxDistance: 200 };
    case RoomSizeName.Auditorium:
      return { minDistance: 50, maxDistance: 230 };
    default:
      return { minDistance: 50, maxDistance: 150 };
  }
};
export const getTargetDataByKeyPermission = (keyPermission: string) => {
  switch (keyPermission) {
    case RoomSizeName.Phonebooth:
      return new Vector3(
        -3.3342790694469784,
        9.269443817758102,
        -3.999528610518013
      );

    default:
      return new Vector3(
        -3.3342790694469784,
        15.269443817758102,
        -3.999528610518013
      );
  }
};
