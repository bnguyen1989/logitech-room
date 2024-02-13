import { ItemElement } from "../elements/ItemElement";
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class AddActiveElementRule extends Rule {
  public name: string = "AddActiveElementRule";
  public element: ItemElement;

  constructor(element: ItemElement) {
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
