export class ItemObject {
	public name: string;
	public dependenceItems: ItemObject[] = [];
	private _isVisible: boolean = true;
	private _active?: boolean = false;


	constructor(name: string) {
		this.name = name;
	}

	public get isVisible(): boolean {
		return this._isVisible;
	}

	public set isVisible(value: boolean) {
		this._isVisible = value;
	}

	public get active(): boolean {
		return this._active ?? false;
	}

	public set active(value: boolean) {
		this._active = value;
	}
}