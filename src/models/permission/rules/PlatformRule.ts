import { StepName } from "../type";
import { Rule } from "./Rule";

export class PlatformRule extends Rule {
  public stepName: StepName = StepName.Platform;
  public isUniqueActiveItem: boolean = true;
}
