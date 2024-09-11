import { Configurator } from "../configurator/Configurator";
import { ValueStringStateI } from "../configurator/type";
import { ItemCommand } from "./ItemCommand";
import { AddItemBehavior } from "./behavior/AddItemBehavior";

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
    this.behaviors.push(new AddItemBehavior());
  }

  public executeCommand(): boolean {
    const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
    if (qtyName) {
      const stateQty = this.configurator.getStateAttributeByName(qtyName);
      if (stateQty) {
        const qty = (stateQty.values as ValueStringStateI[])
          .filter((i) => i.visible)
          .map((i: ValueStringStateI) => i.value);
        const min = Math.min(...qty.map((i: string) => parseInt(i)));
        this.configurator.setConfiguration({
          [qtyName]: (min + 1).toString(),
        });
        this.changeProperties.push(qtyName);
      }
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
