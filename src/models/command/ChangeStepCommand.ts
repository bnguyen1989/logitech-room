import { Command } from "./Command";
import { Configurator } from "../configurator/Configurator";
import { ChangeStepBehavior } from "./behavior/ChangeStepBehavior";
import { DirectionStep, StepName } from "../../utils/baseUtils";
import { DimensionRoomStepBehavior } from "./behavior/DimensionRoomStepBehavior";
export class ChangeStepCommand extends Command {
  public name: string = "ChangeStepCommand";
  public stepName: StepName;
  public direction: DirectionStep;

  constructor(
    configurator: Configurator,
    stepName: StepName,
    direction: DirectionStep
  ) {
    super(configurator);
    this.stepName = stepName;
    this.direction = direction;
    this.behaviors.push(new ChangeStepBehavior());
    this.behaviors.push(new DimensionRoomStepBehavior());
  }

  public executeCommand() {
    return true;
  }
}
