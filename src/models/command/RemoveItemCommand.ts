import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class RemoveItemCommand extends ItemCommand {
  public name: string = "RemoveItemCommand";
  public nameProperty: string;

  constructor(
    configurator: Configurator,
    nameProperty: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
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

    const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
    if (qtyName) {
      this.configurator.setConfiguration({
        [qtyName]: "0",
      });
      this.changeProperties.push(qtyName);
    }

    return true;
  }
}
