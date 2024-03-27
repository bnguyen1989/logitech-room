import { PropertyDependentElement } from '../type'
import { BaseElement } from "./BaseElement";
import { Element } from "./Element";
import { MountElement } from "./mounts/MountElement";

export class ItemElement extends BaseElement implements Element<ItemElement> {
  private dependence: Array<ItemElement | Array<ItemElement>> = [];
  private dependenceMount: Array<MountElement> = [];
  private defaultMount: MountElement | null = null;
  private autoChangeItems: Record<string, Array<string>> = {};
  private reservationMount: Record<string, Array<string | number>> = {};
  private recommendationDependence: PropertyDependentElement = {};
  private requiredDependence: PropertyDependentElement = {};

  constructor(name: string) {
    super(name);
  }

  public addRequiredDependence(
    value: PropertyDependentElement
  ): ItemElement {
    this.requiredDependence = {
      ...this.requiredDependence,
      ...value,
    };
    return this;
  }

  public getRequiredDependence(): PropertyDependentElement {
    return this.requiredDependence;
  }

  public addRecommendationDependence(
    value: PropertyDependentElement
  ): ItemElement {
    this.recommendationDependence = {
      ...this.recommendationDependence,
      ...value,
    };
    return this;
  }

  public getRecommendationDependence(): PropertyDependentElement {
    return this.recommendationDependence;
  }

  /**
   * @description
   * key is name item element;
   * value is array of mount name or mount id
   */
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

  /**
   * 
   * @description
   * add dependent elements and element properties that will affect the display condition of the current element
   */
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

  /**
   * @description
   * key is name item element;
   * value is array property need auto change
   */
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
