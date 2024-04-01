import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class ChangeStepHandler extends Handler {
  public handle(step: Step): boolean {
    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      const isValidDependence = Handler.validateDependence(step, element);
      const isVisible = element.getVisible();
      if (isValidDependence && isVisible) {
        step.addValidElement(element);
      }

      if (isValidDependence && element.getDefaultActive()) {
        step.addActiveElement(element);
      }
    });
    return true;
  }
}
