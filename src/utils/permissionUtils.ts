import { Permission } from "../models/permission/Permission";

export const initPermission = () => {
  const permission = new Permission();

  global["permission"] = permission;
};
