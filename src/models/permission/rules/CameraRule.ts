import { StepName } from "../type";
import { ItemObject } from "../items/ItemObject";
import { Rule } from "./Rule";

export class CameraRule extends Rule {
  public stepName: StepName = StepName.ConferenceCamera;
  public readonly isUniqueActiveItem: boolean = true;

  public getValidItems(): ItemObject[] {
    if (!this.prevRule || this.prevRule.stepName !== StepName.Services) {
      return [];
    }

    return super.getValidItems();
  }
}
