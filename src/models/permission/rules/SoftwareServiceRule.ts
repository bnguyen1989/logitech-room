import { StepName } from "../type";
import { ItemObject } from "../items/ItemObject";
import { Rule } from "./Rule";

export class SoftwareServiceRule extends Rule {
  public stepName: StepName = StepName.SoftwareServices;

  public getValidItems(): ItemObject[] {
    if (
      !this.prevRule ||
      this.prevRule.stepName !== StepName.VideoAccessories
    ) {
      return [];
    }

    return super.getValidItems();
  }
}
