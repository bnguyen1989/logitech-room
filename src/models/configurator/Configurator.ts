import { AssetI } from "../../services/Threekit/type";
import { StepName } from "../../utils/baseUtils";
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
  private _language: string = "en-US";
  private attributes: Array<AttributeI> = [];
  private configuration: ConfigurationI = {};
  private attributeState: AttributesStateI = {};

  public static NameAttrWithMountNames: Record<string, Array<string>> = {
    [AttributeName.RoomCamera]: [AttributeName.RoomCameraMount],
    [AttributeName.RoomMic]: [
      AttributeName.RoomMicMount,
      AttributeName.RoomMicPendantMount,
    ],
    // [AttributeName.RoomMeetingController]: [AttributeName.RoomTapMount],
    [AttributeName.RoomMeetingTap]: [AttributeName.RoomTapMount],
    [AttributeName.RoomMeetingTapIp]: [AttributeName.RoomTapMount],
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
    [AttributeName.RoomAdditionalCamera, AttributeName.QtyAdditionalCamera],
    [AttributeName.RoomCompute],
    [AttributeName.RoomComputeMount],
    [AttributeName.RoomSight],
    [AttributeName.RoomTV],
  ];

  public static AudioExtensionName = [
    [AttributeName.RoomMic, AttributeName.QtyMic],
    [AttributeName.RoomMicMount, AttributeName.QtyMicMount],
    [AttributeName.RoomMicPendantMount, AttributeName.QtyMicPendantMount],
    [AttributeName.RoomMicHub, AttributeName.QtyMicHub],
    [AttributeName.RoomMicCATCoupler],
  ];

  public static MeetingControllerName = [
    // [AttributeName.RoomMeetingController, AttributeName.QtyMeetingController],
    [AttributeName.RoomMeetingTap, AttributeName.QtyMeetingTap],
    [AttributeName.RoomMeetingTapIp, AttributeName.QtyMeetingTapIp],
    [AttributeName.RoomTapMount, AttributeName.QtyTapMount],
    [AttributeName.RoomProductBundle],
  ];

  public static VideoAccessoriesName = [
    [AttributeName.RoomTapScheduler],
    [AttributeName.RoomTapSchedulerAngleMount],
    [AttributeName.RoomTapSchedulerSideMount],
    [AttributeName.RoomScribe],
    [AttributeName.RoomSwytch],
    [AttributeName.RoomExtend],
    [AttributeName.RoomUSBAtoHDMICable],
    [AttributeName.RoomMeetUp2ActiveCable],
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

  public get assetId(): string {
    return this._assetId;
  }

  public set assetId(assetId: string) {
    this._assetId = assetId;
  }

  public get language(): string {
    return this._language;
  }

  public set language(language: string) {
    this._language = language;
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
    configurator.language = this.language;
    configurator.attributes = [...this.attributes];
    configurator.attributesSequenceLevel1 = [...this.attributesSequenceLevel1];
    return configurator;
  }
}
