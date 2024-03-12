import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class ChangeSelectItemCommand extends ItemCommand {
  public name: string = "ChangeSelectItemCommand";
  public assetId: string;
  public nameProperty: string;

  constructor(
    configurator: Configurator,
    nameProperty: string,
    assetId: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.assetId = assetId;
    this.nameProperty = nameProperty;
  }

  public executeCommand(): boolean {
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId: this.assetId,
      },
    });
    this.changeProperties.push(this.nameProperty);
    return true;
  }
}
