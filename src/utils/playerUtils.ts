import { Vector3 } from "three";
import { RoomSizeName } from "./permissionUtils";

export const getDistanceDataByKeyPermission = (
  keyPermission: string,
  dimension: boolean
) => {
  switch (keyPermission) {
    case RoomSizeName.Phonebooth: {
      if (dimension) {
        return { minDistance: 70, maxDistance: 70 };
      }

      return { minDistance: 35, maxDistance: 60 };
    }
    case RoomSizeName.Huddle: {
      if (dimension) {
        return { minDistance: 70, maxDistance: 70 };
      }
      return { minDistance: 40, maxDistance: 70 };
    }

    case RoomSizeName.Small: {
      if (dimension) {
        return { minDistance: 80, maxDistance: 80 };
      }

      return { minDistance: 40, maxDistance: 80 };
    }
    case RoomSizeName.Medium: {
      if (dimension) {
        return { minDistance: 250, maxDistance: 250 };
      }
      return { minDistance: 50, maxDistance: 150 };
    }
    case RoomSizeName.Large: {
      if (dimension) {
        return { minDistance: 280, maxDistance: 280 };
      }
      return { minDistance: 50, maxDistance: 200 };
    }
    case RoomSizeName.Auditorium: {
      if (dimension) {
        return { minDistance: 300, maxDistance: 300 };
      }
      return { minDistance: 50, maxDistance: 230 };
    }
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

export const getPolarAngle = (dimension: boolean) => {
  if (dimension) {
    return {
      minPolarAngle: -Math.PI,
      maxPolarAngle: -Math.PI,
    };
  }
  return {
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: Math.PI / 2,
  };
};
