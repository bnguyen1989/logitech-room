import { Configurator } from "../configurator/Configurator";
import { Command } from "./Command";

export class ChangeColorItemCommand extends Command {
  public name: string = "ChangeCountItemCommand";
  public value: string;
  public assetId: string;

  constructor(configurator: Configurator, value: string, assetId: string) {
    super(configurator);
    this.value = value;
    this.assetId = assetId;
  }

  public executeCommand() {
    return true;
  }
}
