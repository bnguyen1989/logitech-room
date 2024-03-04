import { Element } from "./Element";

export class BaseElement extends Element<BaseElement> {
  public name: string;
  private _isVisible: boolean = true;
  private _defaultActive: boolean = false;
  private _isRequired: boolean = false;
  private _isRecommended: boolean = false;

  constructor(name: string) {
    super();
    this.name = name;
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

  public copy(): BaseElement {
    const baseElement = new BaseElement(this.name);
    return baseElement;
  }
}
