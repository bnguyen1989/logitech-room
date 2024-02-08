export class ItemObject {
	public name: string;
	public dependence: ItemObject[] = [];
	private _isVisible: boolean = true;
	private _defaultActive: boolean = false;
	private _isRequired: boolean = false;


	constructor(name: string) {
		this.name = name;
	}

	public get isVisible(): boolean {
		return this._isVisible;
	}

	public set isVisible(value: boolean) {
		this._isVisible = value;
	}

	public get defaultActive(): boolean {
		return this._defaultActive;
	}

	public set defaultActive(value: boolean) {
		this._defaultActive = value;
	}

	public get isRequired(): boolean {
		return this._isRequired;
	}

	public set isRequired(value: boolean) {
		this._isRequired = value;
	}
}