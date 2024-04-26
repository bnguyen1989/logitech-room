import Role from "../models/user/role/Role";

export enum RoleUserName {
  CUSTOMER = "customer",
  PARTNER = "partner",
  VIEWER = "viewer",
}

export enum PermissionUser {
  ADD_ROOM = "ADD_ROOM",
  REMOVE_ROOM = "REMOVE_ROOM",
  REQUEST_CONSULTATION = "REQUEST_CONSULTATION",
}

export const getRoleByName = (roleName: RoleUserName) => {
  switch (roleName) {
    case RoleUserName.CUSTOMER:
      return getRoleCustomer();
    case RoleUserName.PARTNER:
      return getRolePartner();
    case RoleUserName.VIEWER:
      return getRoleViewer();
    default:
      return getRoleViewer();
  }
};

const getRoleViewer = () =>
  new Role(RoleUserName.VIEWER, [PermissionUser.REQUEST_CONSULTATION]);

const getRoleCustomer = () =>
  new Role(RoleUserName.CUSTOMER, [
    PermissionUser.ADD_ROOM,
    PermissionUser.REMOVE_ROOM,
    PermissionUser.REQUEST_CONSULTATION,
  ]);

const getRolePartner = () =>
  new Role(RoleUserName.PARTNER, [
    PermissionUser.ADD_ROOM,
    PermissionUser.REMOVE_ROOM,
  ]);
