import { Configurator } from "../configurator/Configurator";
import { ValueStringStateI } from "../configurator/type";
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
    const mountNames = Configurator.NameAttrWithMountNames[this.nameProperty];
    if (mountNames) {
      namesRemove.push(...mountNames);
    }
    namesRemove.forEach((name) => {
      this.configurator.setConfiguration({
        [name]: {
          assetId: "",
        },
      });
      this.changeProperties.push(name);

      const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
      if (qtyName) {
        const stateQty = this.configurator.getStateAttributeByName(qtyName);
        if (stateQty) {
          const qty = (stateQty.values as ValueStringStateI[])
            .filter((i) => i.visible)
            .map((i: ValueStringStateI) => i.value);
          const min = Math.min(...qty.map((i: string) => parseInt(i)));
          this.configurator.setConfiguration({
            [qtyName]: min.toString(),
          });
          this.changeProperties.push(qtyName);
        }
      }
    });

    return true;
  }
}
