import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class AddItemCommand extends ItemCommand {
  public name: string = "AddItemCommand";
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
    const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
    if (qtyName) {
      this.configurator.setConfiguration({
        [qtyName]: "1",
      });
      this.changeProperties.push(qtyName);
    }
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId: this.assetId,
      },
    });
    this.changeProperties.push(this.nameProperty);
    return true;
  }
}
