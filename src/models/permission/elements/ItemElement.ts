import { Element } from './Element';

export class ItemElement extends Element<ItemElement>{
	public name: string;
	private _dependence: ItemElement[] = [];
	private _isVisible: boolean = true;
	private _defaultActive: boolean = false;
	private _isRequired: boolean = false;
	private _isRecommended: boolean = false;


	constructor(name: string) {
		super()
		this.name = name;
	}

	public addDependence(item: ItemElement): ItemElement {
		this._dependence.push(item);
		return this;
	}

	public getDependence(): ItemElement[] {
		return this._dependence;
	}

	public getVisible(): boolean {
		return this._isVisible;
	}

	public setVisible(value: boolean) {
		this._isVisible = value;
		return this;
	}

	public getDefaultActive(): boolean {
		return this._defaultActive;
	}

	public setDefaultActive(value: boolean) {
		this._defaultActive = value;
		return this;
	}

	public getRequired(): boolean {
		return this._isRequired;
	}

	public setRequired(value: boolean) {
		this._isRequired = value;
		return this;
	}

	public getRecommended(): boolean {
		return this._isRecommended;
	}

	public setRecommended(value: boolean) {
		this._isRecommended = value;
		return this;
	}

	public getSimpleElements(): Array<ItemElement> {
		return [this];
	}

	public copy(): ItemElement {
		const itemElement = new ItemElement(this.name);
		// itemElement.isVisible = this.isVisible;
		// itemElement.defaultActive = this.defaultActive;
		// itemElement.isRequired = this.isRequired;
		// itemElement.isRecommended = this.isRecommended;
		// itemElement.dependence = this.dependence.map((item) => item.copy());
		return itemElement;
	}
}