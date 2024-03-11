import { Configurator } from "../configurator/Configurator";
import { Command } from "./Command";

export class ItemCommand extends Command {
  public name: string = "ItemCommand";
  public keyItemPermission: string;

  constructor(configurator: Configurator, keyItemPermission: string) {
    super(configurator);
    this.keyItemPermission = keyItemPermission;
  }

  public executeCommand(): boolean {
    return true;
  }
}
