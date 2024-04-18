import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class AvailableStepHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyStep(
      step,
      (step) => {
        return step.getAvailableDependence();
      },
      (step, value) => {
        step.setAvailable(value);
      }
    );
    return true;
  }
}
