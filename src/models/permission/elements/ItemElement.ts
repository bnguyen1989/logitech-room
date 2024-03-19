import { BaseElement } from "./BaseElement";
import { Element } from "./Element";
import { MountElement } from "./MountElement";

export class ItemElement extends BaseElement implements Element<ItemElement> {
  private _dependence: Array<string | Array<string>> = [];
  private _dependenceMount: Array<MountElement> = [];
  private _dependenceColor: Array<string> = [];
  private defaultMount: MountElement | null = null;

  constructor(name: string) {
    super(name);
  }

  public addDependence(item: string | string[]): ItemElement {
    this._dependence.push(item);
    return this;
  }

  public getDependence(): Array<string | Array<string>> {
    return this._dependence;
  }

  public addDependenceMount(mount: MountElement): ItemElement {
    this._dependenceMount.push(mount);
    return this;
  }

  public getDependenceMount(): Array<MountElement> {
    return this._dependenceMount;
  }

  public addDependenceColor(item: string): ItemElement {
    this._dependenceColor.push(item);
    return this;
  }

  public getDependenceColor(): Array<string> {
    return this._dependenceColor;
  }

  public setDefaultMount(mount: MountElement | null): ItemElement {
    this.defaultMount = mount;
    return this;
  }

  public getDefaultMount(): MountElement | null {
    return this.defaultMount;
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
