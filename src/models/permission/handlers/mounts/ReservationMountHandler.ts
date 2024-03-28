import { ItemElement } from "../../elements/ItemElement";
import { CountableMountElement } from "../../elements/mounts/CountableMountElement";
import { Step } from "../../step/Step";
import { Handler } from "../Handler";

export class ReservationMountHandler extends Handler {
  public handle(step: Step): boolean {
    const visibleElements = step.getValidElements();
    visibleElements.forEach((element) => {
      if (!(element instanceof ItemElement)) return;
      const reservationMount = element.getReservationMount();
      if (!Object.keys(reservationMount).length) return;

      const allActiveElements = step.getChainActiveElements().flat();
      Object.entries(reservationMount).forEach(([key, value]) => {
        const isActiveItem = allActiveElements.some((activeElement) => {
          return activeElement.name === key;
        });
        if (!isActiveItem) return;
        const defaultMount = element.getDefaultMount();
        const isNumberArray = value.every((index) => typeof index === "number");
        if (defaultMount instanceof CountableMountElement && isNumberArray) {
          value.forEach((index) => {
            defaultMount.addNotAvailableIndex(index as number);
          });
        }
      });
    });

    return true;
  }
}
