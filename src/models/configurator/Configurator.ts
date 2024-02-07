import { IdGenerator } from "../IdGenerator";
import {
  ConfiguratorDataValueType,
  NamePropertiesConfiguratorType,
  ThreekitDataT,
} from "./type";

export class Configurator {
  public id: string = IdGenerator.generateId();
  private _assetId: string = '';
  private _threekitData: ThreekitDataT = {};

  public static AudioExtensionName = [['Room Mic', 'Qty - Micpod/Expansion']];

  public static CameraName = [['Room Camera'], ['Room Compute']];

  public static MeetingControllerName = [['Room Meeting Controller', 'Qty - Meeting Controller'], ['Room Sight'], ['Room Tap Scheduler'], ['Room Scribe'], ['Room Swytch']];

  public static VideoAccessoriesName = [['Room Compute Mount'], ['Room Tap Mount', 'Qty - Tap Mount'], ['Room Camera Mount'], ['Room Mic Mount', 'Qty - Mic Mount'], ['Room Mic Pod Hub', 'Qty - Mic Pod Hub'], ['Room Mic Pod Extension Cable', 'Qty - Mic Pod Extension Cable']];

  public static SoftwareServicesName = [['Room Device Management Software'], ['Room Support Service']];

  public get assetId(): string {
    return this._assetId;
  }

  public set assetId(assetId: string) {
    this._assetId = assetId;
  }

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
    this.threekitData[propertyName] = {
      ...this.threekitData[propertyName],
      currentValue: value,
    };
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
    configurator.assetId = this.assetId;
    return configurator;
  }
}
