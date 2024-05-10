import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class RequiredElementHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyElement(
      step,
      (element) => {
        return element.getRequiredDependence();
      },
      (element, value) => {
        element.setRequired(value);
      }
    );
    return true;
  }
}
