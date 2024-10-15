import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class DisabledDisplayElementHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyElement(
      step,
      (element) => {
        return element.getDisabledDisplayDependence();
      },
      (element, value) => {
        element.setDisabledDisplay(value);
      }
    );
    return true;
  }
}
