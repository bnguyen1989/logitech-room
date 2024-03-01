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
    const namesRemove: Array<string> = [this.nameProperty];
    const mountName = Configurator.NameAttrWithMountNames[this.nameProperty];
    if (mountName) {
      namesRemove.push(mountName);
    }
    namesRemove.forEach((name) => {
      this.configurator.setConfiguration({
        [name]: {
          assetId: "",
        },
      });
      this.changeProperties.push(name);
    });

    return true;
  }
}
