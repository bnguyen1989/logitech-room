import { Step } from "../../../step/Step";
import { PropertyCountableMountHandler } from "./PropertyCountableMountHandler";

export class SecondaryMountHandler extends PropertyCountableMountHandler {
  public handle(step: Step): boolean {
    this.handleMount(
      step,
      (element) => element.getSecondaryMount(),
      (mount, value) => {
        mount.setSecondaryIndex(value);
      }
    );

    return true;
  }
}
