import { ItemElement } from "../elements/ItemElement";
import { MountElement } from "../elements/mounts/MountElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class RemoveActiveElementHandler extends Handler {
  private element: ItemElement | MountElement;

  constructor(element: ItemElement | MountElement) {
    super();
    this.element = element;
  }

  public handle(step: Step): boolean {
    if (this.element instanceof MountElement) {
      return true;
    }

    const validElements = [...step.getValidElements(), ...step.getActiveElements()];
    validElements.forEach((element) => {
      if (element instanceof MountElement) {
        return;
      }
      const isValidDependence = Handler.validateDependence(step, element);
      if (!isValidDependence) {
        step.removeValidElement(element);
        step.removeActiveElement(element);
      }
    });

    this.element.getDependenceMount().forEach((element) => {
      step.removeValidElement(element);
      step.removeActiveElement(element);
    });

    console.log("RemoveActiveElementHandler", step.getActiveElements());
    

    return true;
  }
}
