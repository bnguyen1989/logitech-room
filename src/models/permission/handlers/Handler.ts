import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";

export abstract class Handler {

  public static validateDependence(step: Step, element: ItemElement) {
    const chainActiveElements = step.getChainActiveElements();
    const dependence = element.getDependence();
    if (!dependence.length) {
      return true;
    }
    return dependence.every((item) => {
      return chainActiveElements.some((activeElements) => {
        return activeElements.some((activeElement) => {
          if (Array.isArray(item)) {
            return item.some((itemElement) => {
              return (
                itemElement.name === activeElement.name &&
                Handler.validateProperty(itemElement, activeElement)
              );
            });
          }
          return (
            activeElement.name === item.name 
						&& Handler.validateProperty(item, activeElement)
          );
        });
      });
    });
  }

	/**
	 * 
	 * @param element1 - this element when added in dependent array
	 * @param element2 - this element when added in activeElements array
	 * @returns boolean
	 */
  private static validateProperty(element1: any, element2: any) {
    const property1 = element1.getProperty();
    const property2 = element2.getProperty();
    if (!Object.keys(property1).length) return true;
    return Object.keys(property1).every((key) => {
      return property1[key] === property2[key];
    });
  }

  public abstract handle(step: Step): boolean;
}
