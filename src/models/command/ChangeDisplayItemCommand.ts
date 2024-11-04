import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class ChangeDisplayItemCommand extends ItemCommand {
  public name: string = "ChangeDisplayItemCommand";
  public value: string;

  constructor(
    configurator: Configurator,
    value: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.value = value;
  }

  public executeCommand() {
    return true;
  }
}
