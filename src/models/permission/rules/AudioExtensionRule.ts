import { StepName } from "../type";
import { ItemObject } from "../items/ItemObject";
import { Rule } from "./Rule";

export class AudioExtensionRule extends Rule {
  public stepName: StepName = StepName.AudioExtensions;
  public readonly isUniqueActiveItem: boolean = true;

  public getValidItems(): ItemObject[] {
    if (
      !this.prevRule ||
      this.prevRule.stepName !== StepName.ConferenceCamera
    ) {
      return [];
    }

    return super.getValidItems();
  }
}
