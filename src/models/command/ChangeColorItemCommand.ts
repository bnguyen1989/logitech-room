import { AssetI } from "../../services/Threekit/type";
import { getSeparatorItem } from "../../utils/baseUtils";
import { CameraName } from "../../utils/permissionUtils";
import { isAssetType } from "../../utils/threekitUtils";
import { Configurator } from "../configurator/Configurator";
import { ChangeRoomCameraBehavior } from "./behavior/ChangeRoomCameraBehavior";
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
    this.behaviors.push(new ChangeRoomCameraBehavior());
  }

  public executeCommand(): boolean {
    const configuration = this.configurator.getConfiguration();
    const qtyName = Configurator.getQtyNameByAttrName(this.nameProperty);
    const item = configuration[this.nameProperty];
    if (qtyName && typeof item === "object" && !item?.assetId?.length) {
      this.configurator.setConfiguration({
        [qtyName]: "1",
      });
      this.changeProperties.push(qtyName);
    }

    const assetId = this.getAssetIdByValue(this.nameProperty, this.value);
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId,
      },
    });
    this.changeProperties.push(this.nameProperty);
    const mounts = Configurator.NameAttrWithMountNames[this.nameProperty];
    mounts?.forEach((mount) => {
      const isSelected = this.isSelectedAttr(mount);
      if (!isSelected) return;
      const assetId = this.getAssetIdByValue(mount, this.value);
      if (!assetId.length) return;
      this.configurator.setConfiguration({
        [mount]: {
          assetId,
        },
      });
      this.changeProperties.push(mount);
    });

    return true;
  }

  private getAssetIdByValue(
    attrName: string,
    value: string,
    keyItemPermission = this.keyItemPermission
  ): string {
    const attributes = this.configurator.getAttributes();
    const attribute = attributes.find(
      (attr) => attr.name === attrName && isAssetType(attr.type)
    );
    if (!attribute) return "";
    const nameItem = this.getNameItemByKeyAndColor(keyItemPermission, value);
    const option = attribute.values.find(
      (opt) =>
        typeof opt === "object" &&
        opt.name.includes(nameItem) &&
        opt.tags?.includes(
          `locale_${this.configurator.language.toLocaleLowerCase()}`
        )
    ) as AssetI;
    return option?.id || "";
  }

  private getNameItemByKeyAndColor(key: string, valueColor: string) {
    const color =
      key === CameraName.RallyPlus ? `with ${valueColor}` : valueColor;

    return `${key}${getSeparatorItem()}${color}`;
  }

  private isSelectedAttr(attrName: string): boolean {
    const configuration = this.configurator.getConfiguration();
    const value = configuration[attrName];
    return typeof value === "object" && !!value?.assetId?.length;
  }
}
