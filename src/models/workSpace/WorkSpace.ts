import { Configurator } from "../configurator/Configurator";
import {
  AssetI,
  NamePropertiesConfiguratorType,
  ThreekitDataT,
} from "../configurator/type";

export class WorkSpace {
  private _configurator: Configurator;

  constructor(configurator: Configurator) {
    this._configurator = configurator;
  }

  public get configurator(): Configurator {
    return this._configurator;
  }

  public set configurator(configurator: Configurator) {
    this._configurator = configurator;
    if (Object.keys(this.configurator.threekitData).length) {
      this.setPropertiesConfigurator(this.configurator.threekitData);
    }
  }

  public async updateProperties(
    propertiesKey: Array<NamePropertiesConfiguratorType>
  ) {
    if (!propertiesKey.length) {
      return;
    }
    const properties: ThreekitDataT = {};
    for (const name of propertiesKey) {
      properties[name] = this.configurator.getValueByPropertyName(name);
    }
    await this.setPropertiesConfigurator(properties);
  }

  public async setPropertiesConfigurator(configuratorData: ThreekitDataT) {
    console.log("setPropertiesConfigurator", configuratorData);
    //set properties in scene
  }

  public getAssetById(assetId: string) {
    let asset: AssetI | null = null;
    Object.values(this.configurator.threekitData).forEach((item) => {
      const values = item.values;
      if (!values) {
        return;
      }
      if(typeof values[0] === 'string') {
        return;
      }
      (values as Array<AssetI>).forEach((value) => {
        if (value.id === assetId) {
          asset = value;
        }
      });
      
    });

    return asset;
  }
}
