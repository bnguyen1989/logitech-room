import { BaseElement } from "./BaseElement";
import { Element } from "./Element";
import { MountElement } from "./MountElement";

export class ItemElement extends BaseElement implements Element<ItemElement> {
  private _dependence: Array<ItemElement | Array<ItemElement>> = [];
  private _dependenceMount: Array<MountElement> = [];
  private defaultMount: MountElement | null = null;

  constructor(name: string) {
    super(name);
  }

  public addDependence(item: ItemElement | ItemElement[]): ItemElement {
    this._dependence.push(item);
    return this;
  }

  public getDependence(): Array<ItemElement | Array<ItemElement>> {
    return this._dependence;
  }

  public addDependenceMount(mount: MountElement): ItemElement {
    this._dependenceMount.push(mount);
    return this;
  }

  public getDependenceMount(): Array<MountElement> {
    return this._dependenceMount;
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
