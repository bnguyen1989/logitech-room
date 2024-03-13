import { AssetI } from "../../services/Threekit/type";
import { isAssetType, isStringType } from "../../utils/threekitUtils";
import { IdGenerator } from "../IdGenerator";
import { StepName } from '../permission/type'
import {
  AttributeI,
  AttributeStateI,
  AttributesStateI,
  ConfigurationI,
} from "./type";

export class Configurator {
  public id: string = IdGenerator.generateId();
  public attributesSequenceLevel1: Array<string> = [];
  private _assetId: string = "";
  private attributes: Array<AttributeI> = [];
  private configuration: ConfigurationI = {};
  private attributeState: AttributesStateI = {};

  public static NameAttrWithMountNames: Record<string, string> = {
    "Room Camera": "Room Camera Mount",
  };

  public static PlatformName = [["Room Service"]];

  public static ServicesName = [["Room Deployment Mode"]];

  public static CameraName = [
    ["Room Camera"],
    ["Room Camera Mount"],
    ["Room Compute"],
    ["Room Compute Mount"],
    ["Room Sight"],
  ];

  public static AudioExtensionName = [
    ["Room Mic", "Qty - Micpod/Expansion"],
    ["Room Mic Mount", "Qty - Mic Mount"],
    ["Room Mic Pod Hub", "Qty - Mic Pod Hub"],
    ["Room Mic Pod Extension Cable", "Qty - Mic Pod Extension Cable"],
  ];

  public static MeetingControllerName = [
    ["Room Meeting Controller", "Qty - Meeting Controller"],
    ["Room Tap Mount", "Qty - Tap Mount"],
  ];

  public static VideoAccessoriesName = [
    ["Room Tap Scheduler"],
    ["Room Scribe"],
    ["Room Swytch"],
  ];

  public static SoftwareServicesName = [
    ["Room Device Management Software"],
    ["Room Support Service"],
  ];

  public static getNamesAttrByStepName(stepName: string): Array<Array<string>> {
    switch (stepName) {
      case StepName.Platform:
        return Configurator.PlatformName;
      case StepName.Services:
        return Configurator.ServicesName;
      case StepName.ConferenceCamera:
        return Configurator.CameraName;
      case StepName.AudioExtensions:
        return Configurator.AudioExtensionName;
      case StepName.MeetingController:
        return Configurator.MeetingControllerName;
      case StepName.VideoAccessories:
        return Configurator.VideoAccessoriesName;
      case StepName.SoftwareServices:
        return Configurator.SoftwareServicesName;
      default:
        return [];
    }
  }


  public static getQtyNameByAttrName(name: string): string {
    return [
      Configurator.AudioExtensionName,
      Configurator.CameraName,
      Configurator.MeetingControllerName,
      Configurator.VideoAccessoriesName,
    ].reduce((acc, curr) => {
      const found = curr.find((item) => item[0] === name);
      if (found && found[1]) {
        return found[1];
      }
      return acc;
    }, "");
  }

  public static getNameNodeForMic(id: number): string {
    return `Mic_Placement_${id}`;
  }

  public static getNameNodeForTap(id: number): string {
    return `Tap_Placement_${id}`;
  }

  public static getNameNodeForCamera(type: "Wall" | "TV", id?: number): string {
    if (type === "Wall") return "Camera_Wall_Placement";
    return `Camera_TV_Placement_${id}`;
  }

  public static getNameNodeForScribe(): string {
    return "Scribe_Placement";
  }

  public static getNameNodeSwytch(): string {
    return "Swytch_Placement";
  }

  public static getNameNodeScheduler(): string {
    return "Scheduler_placement";
  }

  public static getNameNodeMicPodMount(): string {
    return "Pod_Table_Mount_mic_point";
  }

  public static getNameNodeTapRiserMount(): string {
    return "Tap_Riser_Mount_Placement";
  }

  public static getNameNodeTapTableMount(): string {
    return "Tap_Table_Mount_Placement";
  }

  public static getNameNodeCameraWallMount(): string {
    return "Camera_Wall_Mount_Placement";
  }

  public static getNameNodeCameraTVMount(): string {
    return "Camera_TV_Mount_placement";
  }

  public static getAllPlacement(): string[] {
    const getNameNodeForMic = this.getNameNodeForMic;
    const getNameNodeForTap = this.getNameNodeForTap;
    const getNameNodeForCamera = this.getNameNodeForCamera;
    const getNameNodeForScribe = this.getNameNodeForScribe;
    const getNameNodeSwytch = this.getNameNodeSwytch;
    const getNameNodeScheduler = this.getNameNodeScheduler;
    const getNameNodeMicPodMount = this.getNameNodeMicPodMount;
    const getNameNodeTapRiserMount = this.getNameNodeTapRiserMount;
    const getNameNodeTapTableMount = this.getNameNodeTapTableMount;
    const getNameNodeCameraWallMount = this.getNameNodeCameraWallMount;
    const getNameNodeCameraTVMount = this.getNameNodeCameraTVMount;

    return [
      getNameNodeForMic(1),
      getNameNodeForMic(2),
      getNameNodeForMic(3),
      getNameNodeForTap(1),
      getNameNodeForTap(2),
      getNameNodeForTap(3),
      getNameNodeForCamera("Wall"),
      getNameNodeForCamera("TV", 1),
      getNameNodeForCamera("TV", 2),
      getNameNodeForScribe(),
      getNameNodeSwytch(),
      getNameNodeScheduler(),
      getNameNodeMicPodMount(),
      getNameNodeTapRiserMount(),
      getNameNodeTapTableMount(),
      getNameNodeCameraWallMount(),
      getNameNodeCameraTVMount(),
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
    this.attributes.forEach((attribute) => {
      this.setConfiguration({ [attribute.name]: attribute.defaultValue });
      if (isAssetType(attribute.type)) {
        this.attributeState[attribute.id] = {
          disabledValues: [],
          hiddenValues: [],
          enabled: true,
          visible: true,
          values: attribute.values.map((value: AssetI | string) => ({
            ...(value as AssetI),
            enabled: true,
            visible: true,
          })),
        };
      }
      if (isStringType(attribute.type)) {
        this.attributeState[attribute.id] = {
          disabledValues: [],
          hiddenValues: [],
          enabled: true,
          visible: true,
          values: attribute.values.map((value: AssetI | string) => ({
            value: value as string,
            enabled: true,
            visible: true,
          })),
        };
      }
    });
  }

  public getAttributes(): Array<AttributeI> {
    return this.attributes;
  }

  public getAttributeState(): AttributesStateI {
    return this.attributeState;
  }

  public setAttributeState(
    id: string,
    attributeState: Partial<AttributeStateI>
  ) {
    this.attributeState[id] = {
      ...this.attributeState[id],
      ...attributeState,
    };
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

  public getStateAttributeByName(name: string): AttributeStateI | undefined {
    const id = this.getAttributeByName(name)?.id;

    if (!id) return;
    return this.attributeState[id];
  }

  public getAttributeByAssetName(name: string): AttributeI | undefined {
    return this.attributes.find((attribute) =>
      attribute.values.some(
        (value) => typeof value === "object" && value.name === name
      )
    );
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
    configurator.attributesSequenceLevel1 = [...this.attributesSequenceLevel1];
    return configurator;
  }
}
