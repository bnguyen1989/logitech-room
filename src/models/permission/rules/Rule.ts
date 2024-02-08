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

  public getActiveItems(): Array<ItemObject> {
    const activeItems = this.activeItems;
    const defaultActiveNotVisibleItems = this.items.filter(
      (item: ItemObject) => item.defaultActive && !item.isVisible
    );
    const activeItemsWithDependence = this.getActiveItemsWithDependence();
    const requiredItems = this.getRequiredItems();

    return [
      ...activeItems,
      ...defaultActiveNotVisibleItems,
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

  public getRequiredItems(): Array<ItemObject> {
    const requiredItems = this.items.filter(
      (item: ItemObject) => item.isVisible && item.defaultActive && !item.dependence.length
    );
    return requiredItems;
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
}
