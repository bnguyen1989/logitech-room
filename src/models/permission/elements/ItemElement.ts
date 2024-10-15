import {
  ConditionAttributesMountType,
  DependentElement,
  PropertyDependentElement,
} from "../type";
import { BaseElement } from "./BaseElement";
import { Element } from "./Element";
import { MountElement } from "./mounts/MountElement";

export class ItemElement extends BaseElement implements Element<ItemElement> {
  private dependence: DependentElement = {};
  private dependenceMount: Array<MountElement> = [];
  private bundleMount: Array<MountElement> = [];
  private defaultMount: MountElement | null = null;
  private accessoryItems: Array<string> = [];
  private autoChangeItems: Record<string, Array<string>> = {};
  private reservationMount: Record<string, Array<string | number>> = {};
  private secondaryMount: Record<string, Array<string | number>> = {};
  private recommendationDependence: PropertyDependentElement = {};
  private requiredDependence: PropertyDependentElement = {};
  private disabledCounterDependence: PropertyDependentElement = {};
  private disabledColorDependence: PropertyDependentElement = {};
  private bundleMountsDependence: Record<string, Array<string>> = {};
  public conditionAttributesMount: ConditionAttributesMountType = {};
  private disabledDisplayDependence: PropertyDependentElement = {};

  constructor(name: string) {
    super(name);
  }

  public addDisabledDisplayDependence(
    value: PropertyDependentElement
  ): ItemElement {
    this.disabledDisplayDependence = {
      ...this.disabledDisplayDependence,
      ...value,
    };
    return this;
  }

  public getDisabledDisplayDependence(): PropertyDependentElement {
    return this.disabledDisplayDependence;
  }

  public addConditionAttributesMount(
    conditionAttributes: ConditionAttributesMountType
  ): ItemElement {
    this.conditionAttributesMount = {
      ...this.conditionAttributesMount,
      ...conditionAttributes,
    };
    return this;
  }

  public getConditionAttributesMount(): ConditionAttributesMountType {
    return this.conditionAttributesMount;
  }

  public addBundleMountsDependence(
    key: string,
    value: Array<string>
  ): ItemElement {
    this.bundleMountsDependence[key] = value;
    return this;
  }

  public getBundleMountsDependence(): Record<string, Array<string>> {
    return { ...this.bundleMountsDependence };
  }

  public addBundleMount(value: MountElement): ItemElement {
    this.bundleMount.push(value);
    return this;
  }

  public getBundleMount(): Array<MountElement> {
    return [...this.bundleMount];
  }

  public removeBundleMount(value: MountElement): ItemElement {
    this.bundleMount = this.bundleMount.filter(
      (element) => element.name !== value.name
    );
    return this;
  }

  public setAccessoryItems(value: Array<string>): ItemElement {
    this.accessoryItems = value;
    return this;
  }

  public getAccessoryItems(): Array<string> {
    return [...this.accessoryItems];
  }

  public addDisabledColorDependence(
    value: PropertyDependentElement
  ): ItemElement {
    this.disabledColorDependence = {
      ...this.disabledColorDependence,
      ...value,
    };
    return this;
  }

  public getDisabledColorDependence(): PropertyDependentElement {
    return this.disabledColorDependence;
  }

  public addRequiredDependence(value: PropertyDependentElement): ItemElement {
    this.requiredDependence = {
      ...this.requiredDependence,
      ...value,
    };
    return this;
  }

  public getRequiredDependence(): PropertyDependentElement {
    return this.requiredDependence;
  }

  public addDisabledCounterDependence(
    value: PropertyDependentElement
  ): ItemElement {
    this.disabledCounterDependence = {
      ...this.disabledCounterDependence,
      ...value,
    };
    return this;
  }

  public getDisabledCounterDependence(): PropertyDependentElement {
    return this.disabledCounterDependence;
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
   *
   * The method allows you to add secondary nameNodes
   */
  public addSecondaryMount(
    value: Record<string, Array<string | number>>
  ): ItemElement {
    this.secondaryMount = {
      ...this.secondaryMount,
      ...value,
    };
    return this;
  }

  public getSecondaryMount(): Record<string, Array<string | number>> {
    return this.secondaryMount;
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
   * @param key - instruction key
   * @description
   * add dependent elements and element properties that will affect the display condition of the current element
   */
  public addDependence(
    key: string,
    item: ItemElement | Array<ItemElement>
  ): ItemElement {
    const prevDependence = this.dependence[key] ?? [];
    this.dependence = {
      ...this.dependence,
      [key]: [...prevDependence, item],
    };
    return this;
  }

  public getDependence(): DependentElement {
    return this.dependence;
  }

  public addDependenceMount(mount: MountElement): ItemElement {
    this.dependenceMount.push(mount);
    return this;
  }

  public getDependenceMount(): Array<MountElement> {
    return [...this.dependenceMount];
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
    const dependence = this.getDependence();
    Object.entries(dependence).forEach(([key, value]) => {
      value.forEach((dependence) => {
        if (dependence instanceof Array) {
          itemElement.addDependence(
            key,
            dependence.map((item) => item.copy())
          );
        } else {
          itemElement.addDependence(key, dependence.copy());
        }
      });
    });
    this.getDependenceMount().forEach((dependenceMount) => {
      itemElement.addDependenceMount(dependenceMount.copy());
    });
    itemElement.addAutoChangeItems(this.getAutoChangeItems());
    itemElement.setDefaultMount(this.getDefaultMount()?.copy() ?? null);
    return itemElement;
  }
}
