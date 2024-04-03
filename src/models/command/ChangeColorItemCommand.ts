import { AssetI } from "../../services/Threekit/type";
import { isAssetType } from "../../utils/threekitUtils";
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
    if (typeof item === "object" && !item?.assetId?.length) {
      this.configurator.setConfiguration({
        [qtyName]: "1",
      });
      this.changeProperties.push(qtyName);
      const assetId = this.getAssetIdByValue(this.value);
      this.configurator.setConfiguration({
        [this.nameProperty]: {
          assetId,
        },
      });
      this.changeProperties.push(this.nameProperty);
    }
    return true;
  }

  private getAssetIdByValue(value: string): string {
    const attributes = this.configurator.getAttributes();
    const attribute = attributes.find(
      (attr) => attr.name === this.nameProperty && isAssetType(attr.type)
    );
    if (!attribute) return "";
    const option = attribute.values.find(
      (opt) => typeof opt === "object" && opt.name.includes(value)
    ) as AssetI;
    return option?.id || "";
  }
}
