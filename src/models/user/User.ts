import Role from './role/Role'


export class User {
	id: string;
	role: Role;

	constructor(id: string, role: Role) {
		this.id = id;
		this.role = role;
	}

	public get instance(): User {
		return Object.assign(Object.create(this), this);
	}
}