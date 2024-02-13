import { GroupElement } from "../elements/GroupElement";
import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class AddActiveElementHandler extends Handler {
  private element: ItemElement;

  constructor(element: ItemElement) {
    super();
    this.element = element;
  }

  public handle(step: Step): boolean {
    console.log("element", this.element);

    const groups = step.allElements.filter(
      (elem) => elem instanceof GroupElement && elem.isRequiredOne()
    );
    const group = groups.find((group) => {
      const simpleElements = group.getSimpleElements();
      return simpleElements.some((elem) => elem.name === this.element.name);
    });
    if (group) {
      const simpleElements = group
        .getSimpleElements()
        .filter((elem) => elem.getVisible())
        .filter((elem) => elem.name !== this.element.name);
      const activeElements = step.getActiveElements();
      const activeElementsFromGroup = simpleElements.filter((elem) =>
        activeElements.some((activeElem) => activeElem.name === elem.name)
      );
      activeElementsFromGroup.forEach((element) => {
        step.removeActiveElement(element);
      });
    }

    const elements = step.getSimpleElements();
    const activeElements = step.getActiveElements();
    elements.forEach((element) => {
      const validElements = step.getValidElements();
      const isValidDependence = Handler.validateDependence(step, element);
      if (!isValidDependence) {
        step.removeValidElement(element);
        step.removeActiveElement(element);
        return;
      }

      if (!element.getVisible()) {
        return;
      }

      const isAddElementInValid = !validElements.some(
        (elem) => elem.name === element.name
      );

      if (isAddElementInValid) {
        step.addValidElement(element);
      }

      const isAddElementInActive = !activeElements.some(
        (elem) => elem.name === element.name
      );
      if (isAddElementInActive && element.getDefaultActive()) {
        step.addActiveElement(element);
      }
    });

    return true;
  }
}
