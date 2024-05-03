import { PermissionUser, RoleUserName } from "../../../utils/userRoleUtils";

export default class Role {
  name: RoleUserName;
  permissions: Array<PermissionUser>;

  constructor(name: RoleUserName, permissions: Array<PermissionUser>) {
    this.name = name;
    this.permissions = permissions;
  }

  public can(permission: PermissionUser): boolean {
    return this.permissions.includes(permission);
  }

  public get instance(): Role {
    return Object.assign(Object.create(this), this);
  }

  public getData(): { name: RoleUserName; permissions: PermissionUser[] } {
    return {
      name: this.name,
      permissions: this.permissions,
    };
  }
}
