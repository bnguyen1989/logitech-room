import { Configurator } from "../configurator/Configurator";
import { ItemCommand } from "./ItemCommand";

export class ChangeCountItemCommand extends ItemCommand {
  public name: string = "ChangeCountItemCommand";
  public nameProperty: string;
  public value: string;
  public isIncrease: boolean = false;

  constructor(
    configurator: Configurator,
    nameProperty: string,
    value: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.nameProperty = nameProperty;
    this.value = value;
  }

  public executeCommand(): boolean {
    const configuration = this.configurator.getConfiguration();
    const currentValue = parseInt(configuration[this.nameProperty] as string);
    if (parseInt(this.value) > currentValue) {
      this.isIncrease = true;
    }
    this.configurator.setConfiguration({
      [this.nameProperty]: this.value,
    });
    this.changeProperties.push(this.nameProperty);
    return true;
  }
}
