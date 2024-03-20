import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class ChangeColorItemCommand extends ItemCommand {
  public name: string = "ChangeColorItemCommand";
  public nameProperty: string;
  public value: string;

  constructor(
    configurator: Configurator,
    nameProperty: string,
    value: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.value = value;
    this.nameProperty = nameProperty;
  }

  public executeCommand(): boolean {
    const configuration = this.configurator.getConfiguration();
    const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
    const item = configuration[this.nameProperty];
    if(typeof item === "object" && !item?.assetId?.length) {
      this.configurator.setConfiguration({
        [qtyName]: "1",
      });
      this.changeProperties.push(qtyName);
    }
    return true;
  }
}
