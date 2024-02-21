import { IdGenerator } from "../IdGenerator";
import { AttributeI, ConfigurationI } from "./type";

export class Configurator {
  public id: string = IdGenerator.generateId();
  private _assetId: string = "";
  private attributes: Array<AttributeI> = [];
  private configuration: ConfigurationI = {};

  public static AudioExtensionName = [["Room Mic", "Qty - Micpod/Expansion"]];

  public static CameraName = [["Room Camera"], ["Room Compute"]];

  public static MeetingControllerName = [
    ["Room Meeting Controller", "Qty - Meeting Controller"],
    ["Room Sight"],
    ["Room Tap Scheduler"],
    ["Room Scribe"],
    ["Room Swytch"],
  ];

  public static VideoAccessoriesName = [
    ["Room Compute Mount"],
    ["Room Tap Mount", "Qty - Tap Mount"],
    ["Room Camera Mount"],
    ["Room Mic Mount", "Qty - Mic Mount"],
    ["Room Mic Pod Hub", "Qty - Mic Pod Hub"],
    ["Room Mic Pod Extension Cable", "Qty - Mic Pod Extension Cable"],
  ];

  public static SoftwareServicesName = [
    ["Room Device Management Software"],
    ["Room Support Service"],
  ];

  public static getNameNodeForMic(id: number): string {
    return `Mic_Placement_${id}`;
  }

  public static getNameNodeForTap(id: number): string {
    return `Tap_Placement_${id}`;
  }

  public static getNameNodeForCamera(
    type: "Cabinet" | "Wall",
    id?: number
  ): string {
    if (type === "Cabinet") return "Camera_Cabinet_Placement";
    return `Camera_Wall_Placement_${id}`;
  }

  public static getAllPlacement(): string[] {
    const getNameNodeForMic = this.getNameNodeForMic;
    const getNameNodeForTap = this.getNameNodeForTap;
    const getNameNodeForCamera = this.getNameNodeForCamera;
 
    return [
      getNameNodeForMic(1),
      getNameNodeForMic(2),
      getNameNodeForMic(3),
      getNameNodeForTap(1),
      getNameNodeForTap(2),
      getNameNodeForTap(3), 
      getNameNodeForCamera('Cabinet'), 
      getNameNodeForCamera('Wall',1), 
      getNameNodeForCamera('Wall',2), 
    ];
  }

  public get assetId(): string {
    return this._assetId;
  }

  public set assetId(assetId: string) {
    this._assetId = assetId;
  }

  public setAttributes(attributes: Array<AttributeI>) {
    this.attributes = attributes;
  }

  public getAttributes(): Array<AttributeI> {
    return this.attributes;
  }

  public getConfiguration(): ConfigurationI {
    return this.configuration;
  }

  public setConfiguration(configuration: ConfigurationI) {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  }

  public getAttributeByName(name: string): AttributeI | undefined {
    return this.attributes.find((attribute) => attribute.name === name);
  }

  public getSnapshot(): Configurator {
    const configurator = new Configurator();
    if (configurator.configuration) {
      const configuration = Object.assign(
        {},
        this.configuration
      ) as ConfigurationI;
      configurator.configuration = configuration;
    }
    configurator.assetId = this.assetId;
    configurator.attributes = [...this.attributes];
    return configurator;
  }
}
