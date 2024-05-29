import { ItemElement } from "../elements/ItemElement";
import { MountElement } from "../elements/mounts/MountElement";
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class RemoveActiveElementRule extends Rule {
  public name: string = "RemoveActiveElementRule";
  public element: ItemElement | MountElement;

  constructor(element: ItemElement | MountElement) {
    super();
    this.element = element;
  }

  public validate(step: Step): boolean {
    if (this.element instanceof MountElement) {
      return true;
    }
    const isRequired = this.element.getRequired();
    return !(
      isRequired &&
      step.getActiveElements().length > 1
    );
  }
}
