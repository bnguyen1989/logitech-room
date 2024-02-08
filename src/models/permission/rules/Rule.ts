import { StepName } from "../type";
import { ItemObject } from "../items/ItemObject";

export abstract class Rule {
  public abstract stepName: StepName;
  private activeItems: Array<ItemObject> = [];
  private _items: Array<ItemObject> = [];
  private _prevRule: Rule | null = null;
  public readonly isUniqueActiveItem: boolean = false;
  public readonly isRequiredActiveItems: boolean = false;

  public set items(keys: Array<ItemObject>) {
    this._items = keys;
  }

  public get items(): Array<ItemObject> {
    return this._items;
  }

  public set prevRule(rule: Rule | null) {
    this._prevRule = rule;
  }

  public get prevRule(): Rule | null {
    return this._prevRule;
  }

  public addActiveItem(item: ItemObject): void {
    if (this.isUniqueActiveItem) {
      this.activeItems = [item];
      return;
    }
    this.activeItems.push(item);
  }

  public removeActiveItem(item: ItemObject): void {
    if(item.isRequired) return;
    this.activeItems = this.activeItems.filter(
      (activeItem: ItemObject) => activeItem.name !== item.name
    );
  }

  public getActiveItems(): Array<ItemObject> {
    const requiredNotVisibleItems = this.items.filter(
      (item: ItemObject) => item.isRequired && !item.isVisible
    );
    const activeItemsWithDependence = this.getActiveItemsWithDependence();
    const requiredItems = this.getRequiredItems();
    const defaultActiveItems = this.getDefaultActiveItems().filter(
      (item: ItemObject) => !this.activeItems.some((activeItem: ItemObject) => activeItem.name === item.name)
    );

    defaultActiveItems.forEach((item: ItemObject) => {
      item.defaultActive = false;
    });

    this.activeItems.push(...defaultActiveItems);

    return [
      ...this.activeItems,
      ...requiredNotVisibleItems,
      ...activeItemsWithDependence,
      ...requiredItems,
    ];
  }

  public getActiveItemsWithDependence(): Array<ItemObject> {
    const itemsWithDependence: Array<ItemObject> = [];
    this.items.forEach((item: ItemObject) => {
      const isDependence = item.dependence.length > 0;
      if (!isDependence) return;
      const isDependenceActive = item.dependence.every(
        (dependenceItem: ItemObject) =>
          this.activeItems.some(
            (activeItem: ItemObject) => activeItem.name === dependenceItem.name
          )
      );
      if (isDependenceActive) itemsWithDependence.push(item);
    });
    return itemsWithDependence;
  }

  public getValidItems(): Array<ItemObject> {
    const visibleItems = this.items.filter(
      (item: ItemObject) => item.isVisible && !item.dependence.length
    );
    const activeItemsDependence = this.getActiveItemsWithDependence();

    return [...visibleItems, ...activeItemsDependence];
  }

  protected getChainKeys(): Array<Array<ItemObject>> {
    const keys: Array<Array<ItemObject>> = [];
    if (this.activeItems.length > 0) {
      keys.push(this.activeItems);
    }
    let rule: Rule | null = this.prevRule;
    while (rule) {
      if (rule.activeItems.length > 0) {
        keys.push(rule.activeItems);
      }
      rule = rule.prevRule;
    }
    return keys.reverse();
  }

  private getRequiredItems(): Array<ItemObject> {
    const requiredItems = this.items.filter(
      (item: ItemObject) => item.isVisible && item.isRequired && !item.dependence.length
    );
    return requiredItems;
  }

  private getDefaultActiveItems(): Array<ItemObject> {
    const defaultActiveItems = this.items.filter(
      (item: ItemObject) => item.isVisible && item.defaultActive && !item.dependence.length
    );
    return defaultActiveItems;
  }
}
