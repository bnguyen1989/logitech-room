import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class ChangeColorItemCommand extends ItemCommand {
  public name: string = "ChangeColorItemCommand";
  public value: string;

  constructor(
    configurator: Configurator,
    value: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.value = value;
  }
}
