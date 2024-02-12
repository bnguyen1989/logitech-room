import { Permission } from "../models/permission/Permission";
import {
  AudioExtensionName,
  CameraName,
  MeetingControllerName,
  PlatformName,
  RoomSizeName,
  ServiceName,
  SoftwareServicesName,
  VideoAccessoryName,
} from "../models/permission/data";

export const initPermission = () => {
  const permission = new Permission();

  global["permission"] = permission;
};

export const getPermissionNameByItemName = (itemName: string) => {
  const permissionNames = [
    ...Object.values(PlatformName),
    ...Object.values(RoomSizeName),
    ...Object.values(ServiceName),
    ...Object.values(CameraName),
    ...Object.values(AudioExtensionName),
    ...Object.values(MeetingControllerName),
    ...Object.values(VideoAccessoryName),
    ...Object.values(SoftwareServicesName),
  ];

  return permissionNames.find(
    (name) => itemName.toLowerCase() === name.toLowerCase()
  );
};

export const isCamera = (name: string) => {
  return isCompareName(name)([
    // CameraName.RallyBar, 
    CameraName.RallyBarMini
  ]);
};

export const isMic = (name: string) => {
  return isCompareName(name)([AudioExtensionName.RallyMicPod]);
};

export const isTap = (name: string) => {
  return isCompareName(name)([
    MeetingControllerName.LogitechTapIP,
    MeetingControllerName.LogitechTap,
  ]);
};

function isCompareName(name: string) {
  return (arrayNames: Array<string>) => {
    return arrayNames.some((item) => item.toLowerCase() === name.toLowerCase());
  };
}
