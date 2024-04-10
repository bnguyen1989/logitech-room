import { Step } from "../../step/Step";
import { PropertyElementHandler } from "./PropertyElementHandler";

export class DisabledCounterElementHandler extends PropertyElementHandler {
  public handle(step: Step): boolean {
    PropertyElementHandler.setValuePropertyElement(
      step,
      (element) => {
        return element.getDisabledCounterDependence();
      },
      (element, value) => {
        element.setDisabledCounter(value);
      }
    );
    return true;
  }
}
