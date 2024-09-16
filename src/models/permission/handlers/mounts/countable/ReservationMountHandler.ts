import { Step } from "../../../step/Step";
import { PropertyCountableMountHandler } from "./PropertyCountableMountHandler";

export class ReservationMountHandler extends PropertyCountableMountHandler {
  public handle(step: Step): boolean {
    this.handleMount(
      step,
      (element) => element.getReservationMount(),
      (mount, value) => {
        value.forEach((index) => mount.addNotAvailableIndex(index));
      }
    );

    return true;
  }
}
