import { IdGenerator } from "../IdGenerator";
import {
  ConfiguratorDataValueType,
  NamePropertiesConfiguratorType,
  ThreekitDataT,
} from "./type";

export class Configurator {
  public id: string = IdGenerator.generateId();
  private _threekitData: ThreekitDataT = {};

  public get threekitData(): ThreekitDataT {
    return this._threekitData;
  }

  public set threekitData(threekitData: ThreekitDataT) {
    this._threekitData = threekitData;
  }

  public setPropertyThreekitData(
    propertyName: NamePropertiesConfiguratorType,
    value: ConfiguratorDataValueType
  ) {
    this.threekitData[propertyName] = value;
  }

  public getValueByPropertyName(propertyName: NamePropertiesConfiguratorType) {
    return this.threekitData[propertyName];
  }

  public getSnapshot(): Configurator {
    const configurator = new Configurator();
    if (configurator.threekitData) {
      const threekitData = Object.assign(
        {},
        this.threekitData
      ) as ThreekitDataT;
      configurator.threekitData = threekitData;
    }
    return configurator;
  }
}
