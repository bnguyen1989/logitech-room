import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class DisabledColorElementHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyElement(
      step,
      (element) => {
        return element.getDisabledColorDependence();
      },
      (element, value) => {
        element.setDisabledColor(value);
      }
    );
    return true;
  }
}
