import Role from "./role/Role";

export class User {
  public id: string;
  public role: Role;
  public data: Record<string, any> = {};

  constructor(id: string, role: Role) {
    this.id = id;
    this.role = role;
  }

  public setUserData(data: Record<string, any>): User {
    this.data = data;
    return this;
  }

  public isEmptyUserData(): boolean {
    return Object.keys(this.data).length === 0;
  }
}
