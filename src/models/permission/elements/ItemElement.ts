import { BaseElement } from "./BaseElement";
import { Element } from "./Element";
import { MountElement } from "./MountElement";

export class ItemElement extends BaseElement implements Element<ItemElement> {
  private dependence: Array<ItemElement | Array<ItemElement>> = [];
  private dependenceMount: Array<MountElement> = [];
  private defaultMount: MountElement | null = null;
  private autoChangeItems: Record<string, Array<string>> = {};
  private reservationMount: Record<string, Array<string | number>> = {};

  constructor(name: string) {
    super(name);
  }

  public addReservationMount(
    value: Record<string, Array<string | number>>
  ): ItemElement {
    this.reservationMount = {
      ...this.reservationMount,
      ...value,
    };
    return this;
  }

  public getReservationMount(): Record<string, Array<string | number>> {
    return this.reservationMount;
  }

  public addDependence(item: ItemElement | Array<ItemElement>): ItemElement {
    this.dependence.push(item);
    return this;
  }

  public getDependence(): Array<ItemElement | Array<ItemElement>> {
    return this.dependence;
  }

  public addDependenceMount(mount: MountElement): ItemElement {
    this.dependenceMount.push(mount);
    return this;
  }

  public getDependenceMount(): Array<MountElement> {
    return this.dependenceMount;
  }

  public addAutoChangeItems(value: Record<string, Array<string>>): ItemElement {
    this.autoChangeItems = {
      ...this.autoChangeItems,
      ...value,
    };
    return this;
  }

  public getAutoChangeItems(): Record<string, Array<string>> {
    return this.autoChangeItems;
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
    this.getDependence().forEach((dependence) => {
      if (dependence instanceof Array) {
        itemElement.addDependence(dependence.map((item) => item.copy()));
      } else {
        itemElement.addDependence(dependence.copy());
      }
    });
    this.getDependenceMount().forEach((dependenceMount) => {
      itemElement.addDependenceMount(dependenceMount.copy());
    });
    itemElement.addAutoChangeItems(this.getAutoChangeItems());
    itemElement.setDefaultMount(this.getDefaultMount()?.copy() ?? null);
    return itemElement;
  }
}
