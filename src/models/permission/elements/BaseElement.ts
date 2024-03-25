import { Element } from "./Element";

export class BaseElement extends Element<BaseElement> {
  public name: string;
  private _isVisible: boolean = true;
  private _defaultActive: boolean = false;
  private _isRequired: boolean = false;
  private _isRecommended: boolean = false;
  private _isActionDisabled: boolean = false;
  private property: Record<string, any> = {};

  constructor(name: string) {
    super();
    this.name = name;
  }

  public setProperty(property: Record<string, any>): BaseElement {
    this.property = {
      ...this.property,
      ...property,
    };
    return this;
  }

  public getProperty(): Record<string, any> {
    return this.property;
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

  public getActionDisabled(): boolean {
    return this._isActionDisabled;
  }

  public setActionDisabled(value: boolean) {
    this._isActionDisabled = value;
    return this;
  }

  public isEquals(element: BaseElement): boolean {
    return this.name === element.name;
  }

  public copy(): BaseElement {
    const baseElement = new BaseElement(this.name);
    baseElement.setVisible(this.getVisible());
    baseElement.setDefaultActive(this.getDefaultActive());
    baseElement.setRequired(this.getRequired());
    baseElement.setRecommended(this.getRecommended());
    baseElement.setActionDisabled(this.getActionDisabled());
    baseElement.setProperty(this.getProperty());
    return baseElement;
  }
}
