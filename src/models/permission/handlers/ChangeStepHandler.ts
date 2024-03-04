import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class ChangeStepHandler extends Handler {
  public handle(step: Step): boolean {
    const validElements = step.getValidElements();
    if (validElements.length > 0) {
      return true;
    }
    step.clearTempData();
    const elements = step.getSimpleElements();
    const visibleElements = elements.filter((element) => {
      return element.getVisible();
    });

    visibleElements.forEach((element) => {
      const isValidDependence = Handler.validateDependence(step, element);
      if (isValidDependence) {
        this.setValidElement(step, element);
      }
    });

    const notVisibleElements = elements.filter((element) => {
      return !element.getVisible();
    });

    notVisibleElements.forEach((element) => {
      const isValidDependence = Handler.validateDependence(step, element);
      if (isValidDependence && element.getDefaultActive()) {
        step.addActiveElement(element);
      }
    });

    return true;
  }

  private setValidElement(step: Step, element: ItemElement) {
    step.addValidElement(element);
    if (element.getDefaultActive()) {
      step.addActiveElement(element);
    }
  }
}
