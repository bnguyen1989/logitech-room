import { ItemElement } from "../elements/ItemElement";
import { MountElement } from '../elements/mounts/MountElement'
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class AddActiveElementRule extends Rule {
  public name: string = "AddActiveElementRule";
  public element: ItemElement | MountElement;

  constructor(element: ItemElement | MountElement) {
    super();
    this.element = element;
  }

  public validate(step: Step): boolean {
    const activeElements = step.getActiveElements();
    return !activeElements.some(
      (element) => element.name === this.element.name
    );
  }
}
