import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class ChangeStepHandler extends Handler {
  public handle(step: Step): boolean {
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

    const stepActiveElements = step.getActiveElements();
    stepActiveElements.forEach((element) => {
      if (element instanceof ItemElement) {
        const mountElements = element.getDependenceMount();
        const defaultMountElement = element.getDefaultMount();
        mountElements.forEach((mount) => {
          step.addValidElement(mount);
          if(defaultMountElement && mount.name === defaultMountElement.name) {
            step.addActiveElement(mount);
          }
        });
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
