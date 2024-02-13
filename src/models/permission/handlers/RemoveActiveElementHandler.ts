import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class RemoveActiveElementHandler extends Handler {
  private element: ItemElement;

  constructor(element: ItemElement) {
    super();
    this.element = element;
  }

  public handle(step: Step): boolean {
		console.log("element", this.element);
		
		const validElements = step.getValidElements();
		validElements.forEach((element) => {
			const isValidDependence = Handler.validateDependence(step, element);
			if(!isValidDependence) {
				step.removeValidElement(element);
				step.removeActiveElement(element);
			}
		});
    return true;
  }
}
