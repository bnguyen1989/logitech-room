import { ItemElement } from "../../elements/ItemElement";
import { CountableMountElement } from "../../elements/mounts/CountableMountElement";
import { MountElement } from "../../elements/mounts/MountElement";
import { Step } from "../../step/Step";
import { PropertyDependentElement } from "../../type";
import { Handler } from "../Handler";

export class PropertyHandler extends Handler {
  public static setValuePropertyElement(
    step: Step,
    getDependentElement: (element: ItemElement) => PropertyDependentElement,
    callback: (element: ItemElement, value: boolean) => void
  ) {
    const activeElements = step.getChainActiveElements().flat();
    const allValidElements = step.getChainElements().flat();

    const validItemElements: ItemElement[] = step
      .getValidElements()
      .filter((el): el is ItemElement => el instanceof ItemElement);
    PropertyHandler.dependencyPropertyLogicItems<ItemElement>(
      validItemElements,
      activeElements,
      allValidElements,
      getDependentElement,
      callback
    );

    return true;
  }
  public static setValuePropertyStep(
    step: Step,
    getDependentElement: (step: Step) => PropertyDependentElement,
    callback: (step: Step, value: boolean) => void
  ) {
    const steps = step.getChainSteps();
    const lastStep = steps[steps.length - 1];
    const activeElements = lastStep.getChainActiveElements().flat();
    const allValidElements = lastStep.getChainElements().flat();

    PropertyHandler.dependencyPropertyLogicItems<Step>(
      steps,
      activeElements,
      allValidElements,
      getDependentElement,
      callback
    );
    return true;
  }

  private static dependencyPropertyLogicItems<T>(
    items: T[],
    activeElements: (ItemElement | MountElement)[],
    allValidElements: (ItemElement | MountElement)[],
    getDependentItem: (item: T) => PropertyDependentElement,
    callback: (item: T, value: boolean) => void
  ) {
    items.forEach((element) => {
      const data = getDependentItem(element);
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
  }

  public handle(step: Step): boolean {
    if (!step) return false;
    return true;
  }
}
