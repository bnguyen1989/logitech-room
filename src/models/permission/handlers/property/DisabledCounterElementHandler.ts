import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class DisabledCounterElementHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyElement(
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
