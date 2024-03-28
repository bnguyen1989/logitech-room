import { Step } from "../../step/Step";
import { PropertyElementHandler } from "./PropertyElementHandler";

export class RequiredElementHandler extends PropertyElementHandler {
  public handle(step: Step): boolean {
    PropertyElementHandler.setValuePropertyElement(
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
