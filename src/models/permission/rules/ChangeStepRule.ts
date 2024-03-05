import { GroupElement } from "../elements/GroupElement";
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class ChangeStepRule extends Rule {
  public name: string = "ChangeStepRule";
  public direction: "next" | "prev";

  constructor(direction: "next" | "prev") {
    super();
    this.direction = direction;
  }

  public validate(step: Step): boolean {
    if (this.direction === "prev") {
      return true;
    }

    const groups = step.allElements.filter(
      (element) => element instanceof GroupElement && element.isRequiredOne()
    ) as Array<GroupElement>;
    if (!groups.length) {
      return true;
    }

    return groups.every((group) => this.validateGroup(group, step));
  }

  private validateGroup(group: GroupElement, step: Step): boolean {
    if (group.isRequiredOne() && step.isEmptyActiveElements()) {
      return false;
    }
    const simpleElements = group.getSimpleElements();
    const activeElements = step
      .getActiveElements()
      .filter((element) => element.getVisible());

    return simpleElements.some((simpleElement) =>
      activeElements.some((activeElement) =>
        simpleElement.isEquals(activeElement)
      )
    );
  }
}