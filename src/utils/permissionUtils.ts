import { Permission } from "../models/permission/Permission";
import {
  AudioExtensionName,
  CameraName,
  MeetingControllerName,
  PlatformName,
  RoomSizeName,
  ServiceName,
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
  ];

  return permissionNames.find((name) =>
    itemName.toLocaleLowerCase().includes(name.toLowerCase())
  );
};
