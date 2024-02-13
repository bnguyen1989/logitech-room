import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class RemoveActiveElementRule extends Rule {
  public name: string = "RemoveActiveElementRule";
  public element: ItemElement;

  constructor(element: ItemElement) {
    super();
    this.element = element;
  }

  public validate(step: Step): boolean {
    const isRequired = this.element.getRequired();
    const isDefaultActive = this.element.getDefaultActive();
    return !(
      isRequired &&
      isDefaultActive &&
      step.getActiveElements().length > 1
    );
  }
}
