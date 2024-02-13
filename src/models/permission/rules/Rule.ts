import { Step } from '../step/Step'


export abstract class Rule {
  public abstract name: string;


  public abstract validate(step: Step): boolean;

  // public getActiveItems(): Array<ItemObject> {
  //   const requiredNotVisibleItems = this.items.filter(
  //     (item: ItemObject) => item.isRequired && !item.isVisible
  //   );
  //   const activeItemsWithDependence = this.getActiveItemsWithDependence();
  //   const requiredItems = this.getRequiredItems();
  //   const defaultActiveItems = this.getDefaultActiveItems().filter(
  //     (item: ItemObject) => !this.activeItems.some((activeItem: ItemObject) => activeItem.name === item.name)
  //   );

  //   this.activeItems.push(...defaultActiveItems);

  //   return [
  //     ...this.activeItems,
  //     ...requiredNotVisibleItems,
  //     ...activeItemsWithDependence,
  //     ...requiredItems,
  //   ];
  // }

  // public getActiveItemsWithDependence(): Array<ItemObject> {
  //   const itemsWithDependence: Array<ItemObject> = [];
  //   this.items.forEach((item: ItemObject) => {
  //     const isDependence = item.dependence.length > 0;
  //     if (!isDependence) return;
  //     const isDependenceActive = item.dependence.every(
  //       (dependenceItem: ItemObject) =>
  //         this.activeItems.some(
  //           (activeItem: ItemObject) => activeItem.name === dependenceItem.name
  //         )
  //     );
  //     if (isDependenceActive) itemsWithDependence.push(item);
  //   });
  //   return itemsWithDependence;
  // }

  // public getValidItems(): Array<ItemObject> {
  //   const visibleItems = this.items.filter(
  //     (item: ItemObject) => item.isVisible && !item.dependence.length
  //   );
  //   const activeItemsDependence = this.getActiveItemsWithDependence();

  //   return [...visibleItems, ...activeItemsDependence];
  // }

  // private getRequiredItems(): Array<ItemObject> {
  //   const requiredItems = this.items.filter(
  //     (item: ItemObject) => item.isVisible && item.isRequired && !item.dependence.length
  //   );
  //   return requiredItems;
  // }

  // private getDefaultActiveItems(): Array<ItemObject> {
  //   const defaultActiveItems = this.items.filter(
  //     (item: ItemObject) => item.isVisible && item.defaultActive && !item.dependence.length
  //   );
  //   return defaultActiveItems;
  // }
}
