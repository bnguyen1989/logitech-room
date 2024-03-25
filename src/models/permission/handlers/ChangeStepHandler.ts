import { CountableMountElement } from "../elements/CountableMountElement";
import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class ChangeStepHandler extends Handler {
  public handle(step: Step): boolean {
    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      const isValidDependence = Handler.validateDependence(step, element);
      const isVisible = element.getVisible();
      if (isValidDependence && isVisible) {
        step.addValidElement(element);
      }

      if (isValidDependence && element.getDefaultActive()) {
        step.addActiveElement(element);
      }
    });

    const stepActiveElements = step.getActiveElements();
    stepActiveElements.forEach((element) => {
      if (element instanceof ItemElement) {
        const mountElements = element.getDependenceMount();
        mountElements.forEach((mount) => {
          step.addValidElement(mount);
        });

        const isSomeMountActive = mountElements.some((mount) => {
          return stepActiveElements.some((activeElement) => {
            return activeElement.name === mount.name;
          });
        });
        const defaultMount = element.getDefaultMount();
        if (mountElements.length && !isSomeMountActive && defaultMount) {
          step.addActiveElement(defaultMount);
        }
      }
    });

    const visibleElements = step.getValidElements();
    visibleElements.forEach((element) => {
      if (element instanceof ItemElement) {
        this.processReservationMount(step, element);
      }
    });

    return true;
  }

  private processReservationMount(
    step: Step,
    element: ItemElement
  ): void {
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
  }
}
