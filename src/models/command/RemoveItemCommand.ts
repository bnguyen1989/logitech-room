import { Configurator } from "../configurator/Configurator";
import { Command } from "./Command";

export class RemoveItemCommand extends Command {
  public name: string = "RemoveItemCommand";
  public assetId: string;
  public nameProperty: string;

  constructor(
    configurator: Configurator,
    nameProperty: string,
    assetId: string
  ) {
    super(configurator);
    this.assetId = assetId;
    this.nameProperty = nameProperty;
  }

  public executeCommand(): boolean {
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId: "",
      },
    });
    this.changeProperties.push(this.nameProperty);
    return true;
  }
}
