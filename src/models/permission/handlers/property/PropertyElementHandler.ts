import { ItemElement } from "../../elements/ItemElement";
import { CountableMountElement } from "../../elements/mounts/CountableMountElement";
import { Step } from "../../step/Step";
import { PropertyDependentElement } from "../../type";
import { Handler } from "../Handler";

export class PropertyElementHandler extends Handler {
  public static setValuePropertyElement(
    step: Step,
    getDependentElement: (element: ItemElement) => PropertyDependentElement,
    callback: (element: ItemElement, value: boolean) => void
  ) {
    const activeElements = step.getChainActiveElements().flat();
    const allValidElements = step.getChainElements().flat();

    const validElements = step.getValidElements();
    validElements.forEach((element) => {
      if (!(element instanceof ItemElement)) return;
      const data = getDependentElement(element);
      if (!Object.keys(data).length) return;
      const arrayRes = Object.entries(data).map(([key, value]) => {
        const isActive = value["active"];
        const activeElement = activeElements.find(
          (activeElement) => activeElement.name === key
        );
        if (isActive && !activeElement) {
          return false;
        }
        if (!isActive && activeElement) {
          return false;
        }

        const elementDepend = Step.getElementByName(key, allValidElements);
        if (!(elementDepend instanceof ItemElement)) {
          return false;
        }

        const property = elementDepend.getProperty();

        const valueProperty = value["property"];

        if (!valueProperty) return true;

        const color = valueProperty["color"];
        const count = valueProperty["count"];

        let res = true;
        if (color) {
          res = property["color"] === color;
        }
        if (count) {
          const defaultMount = elementDepend.getDefaultMount();
          if (!(defaultMount instanceof CountableMountElement)) return false;
          res = defaultMount.activeIndex === count;
        }
        return res;
      });
      const value = arrayRes.every((res) => res);
      callback(element, value);
    });

    return true;
  }
  public handle(step: Step): boolean {
    if (!step) return false;
    return true;
  }
}
