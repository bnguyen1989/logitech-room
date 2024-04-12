import { AssetI } from "../../services/Threekit/type";
import { StepName } from '../../utils/baseUtils'
import { isAssetType, isStringType } from "../../utils/threekitUtils";
import { IdGenerator } from "../IdGenerator";
import {
  AttributeI,
  AttributeName,
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

  public static NameAttrWithMountNames: Record<string, Array<string>> = {
    [AttributeName.RoomCamera]: [AttributeName.RoomCameraMount],
    [AttributeName.RoomMic]: [
      AttributeName.RoomMicMount,
      AttributeName.RoomMicPendantMount,
    ],
    [AttributeName.RoomMeetingController]: [AttributeName.RoomTapMount],
    [AttributeName.RoomTapScheduler]: [
      AttributeName.RoomTapSchedulerAngleMount,
      AttributeName.RoomTapSchedulerSideMount,
    ],
  };

  public static PlatformName = [[AttributeName.RoomService]];

  public static ServicesName = [[AttributeName.RoomDeployment]];

  public static CameraName = [
    [AttributeName.RoomCamera],
    [AttributeName.RoomCameraMount],
    [AttributeName.RoomCompute],
    [AttributeName.RoomComputeMount],
    [AttributeName.RoomSight],
  ];

  public static AudioExtensionName = [
    [AttributeName.RoomMic, AttributeName.QtyMic],
    [AttributeName.RoomMicMount, AttributeName.QtyMicMount],
    [AttributeName.RoomMicPendantMount, AttributeName.QtyMicPendantMount],
    [AttributeName.RoomMicHub, AttributeName.QtyMicHub],
    [AttributeName.RoomMicExtensionCable, AttributeName.QtyMicExtensionCable],
    [AttributeName.RoomMicCATCoupler],
  ];

  public static MeetingControllerName = [
    [AttributeName.RoomMeetingController, AttributeName.QtyMeetingController],
    [AttributeName.RoomTapMount, AttributeName.QtyTapMount],
  ];

  public static VideoAccessoriesName = [
    [AttributeName.RoomTapScheduler],
    [AttributeName.RoomTapSchedulerAngleMount],
    [AttributeName.RoomTapSchedulerSideMount],
    [AttributeName.RoomScribe],
    [AttributeName.RoomSwytch],
    [AttributeName.RoomExtend],
    [AttributeName.RoomUSBAtoHDMICable],
  ];

  public static SoftwareServicesName = [
    [AttributeName.RoomDeviceManagementSoftware],
    [AttributeName.RoomSupportService],
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

  public static getNameNodeForMic(id?: number): string {
    if (!id) return `Mic_Placement`;
    return `Mic_Placement_${id}`;
  }

  public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
    return `Tap_Placement_${type}_${id}`;
  }

  public static getNameNodeForCamera(type: "Wall" | "TV", id: number): string {
    return `Camera_${type}_Placement_${id}`;
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

  public static getNameNodePendantMount(id?: number): string {
    if (!id) return `Mic_Placement_pedant`;
    return `Mic_Placement_pedant_${id}`;
  }

  public static getNameNodePodPendantMount(): string {
    return "Pod_Pendant_Mount_Point";
  }

  public static getNameNodeAngleMountScheduler(): string {
    return "Angle_Mount_scheduler_point";
  }

  public static getNameNodeSideMountScheduler(): string {
    return "Side_Mount_scheduler_point";
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
    const getNameNodePendantMount = this.getNameNodePendantMount;
    const getNameNodePodPendantMount = this.getNameNodePodPendantMount;
    const getNameNodeAngleMountScheduler = this.getNameNodeAngleMountScheduler;
    const getNameNodeSideMountScheduler = this.getNameNodeSideMountScheduler;

    return [
      getNameNodeForMic(1),
      getNameNodeForMic(2),
      getNameNodeForMic(3),
      getNameNodeForTap("Wall", 1),
      getNameNodeForTap("Table", 1),
      getNameNodeForTap("Table", 2),
      getNameNodeForCamera("Wall", 1),
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
      getNameNodePendantMount(1),
      getNameNodePendantMount(2),
      getNameNodePodPendantMount(),
      getNameNodeAngleMountScheduler(),
      getNameNodeSideMountScheduler(),
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
