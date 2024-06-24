import { AssetI, DefaultValueI, MetadataI } from "../../services/Threekit/type";

export type ThreekitDataT = {
  [key: NamePropertiesConfiguratorType]: AttributeI;
};

export type NamePropertiesConfiguratorType = string;

export type ConfiguratorDataValueType = string | AssetI;

export interface AttributeI {
  id: string;
  type: string;
  name: string;
  metadata: MetadataI;
  values: Array<AssetI | string>;
  defaultValue: DefaultValueI | string;
  assetType?: string;
}

export interface ConfigurationI {
  [key: string]: string | DefaultValueI;
}

export interface AttributesStateI {
  [key: string]: AttributeStateI;
}

export interface AttributeStateI {
  disabledValues: Array<ValueAttributeStateI>;
  enabled: boolean;
  hiddenValues: Array<ValueAttributeStateI>;
  visible: boolean;
  values: Array<ValueAttributeStateI>;
}

export type ValueAttributeStateI = ValueStringStateI | ValueAssetStateI;

export interface ValueStringStateI {
  value: string;
  enabled: boolean;
  visible: boolean;
}
export interface ValueAssetStateI extends AssetI {
  enabled: boolean;
  visible: boolean;
}

export enum AttributeName {
  RoomLocale = "Room Locale",
  RoomService = "Room Service",
  RoomDeployment = "Room Deployment Mode",
  RoomCamera = "Room Camera",
  RoomCameraMount = "Room Camera Mount",
  RoomAdditionalCamera = "Room Additional Camera",
  QtyAdditionalCamera = "Qty - Additional Camera",
  RoomCompute = "Room Compute",
  RoomComputeMount = "Room Compute Mount",
  RoomSight = "Room Sight",
  RoomTV = "Room TV#not-ui",
  RoomMic = "Room Mic",
  QtyMic = "Qty - Micpod",
  RoomMicMount = "Room Mic Mount",
  QtyMicMount = "Qty - Mic Mount",
  RoomMicPendantMount = "Room Mic Pod Pendant Mount",
  QtyMicPendantMount = "Qty - Mic Pendant Mount",
  RoomMicHub = "Room Mic Pod Hub",
  QtyMicHub = "Qty - Mic Pod Hub",
  RoomMicCATCoupler = "Room Mic Pod CAT Coupler",
  RoomMeetingTap = "Room Meeting Tap",
  QtyMeetingTap = "Qty - Meeting Tap",
  RoomMeetingTapIp = "Room Meeting TapIp",
  QtyMeetingTapIp = "Qty - Meeting TapIp",
  RoomTapTableMount = "Room Tap Table Mount",
  QtyTapTableMount = "Qty - Tap Table Mount",
  RoomTapRiserMount = "Room Tap Riser Mount",
  QtyTapRiserMount = "Qty - Tap Riser Mount",
  RoomTapWallMount = "Room Tap Wall Mount",
  QtyTapWallMount = "Qty - Tap Wall Mount",
  RoomProductBundle = "Room Product Bundle",
  RoomTapScheduler = "Room Tap Scheduler",
  RoomTapSchedulerAngleMount = "Room Tap Scheduler Angle Mount",
  RoomTapSchedulerSideMount = "Room Tap Scheduler Side Mount#not-ui",
  RoomScribe = "Room Scribe",
  RoomSwytch = "Room Swytch",
  RoomExtend = "Room Extend",
  RoomUSBAtoHDMICable = "Room USB-A to HDMI Cable",
  RoomDeviceManagementSoftware = "Room Device Management Software",
  RoomSupportService = "Room Support Service",
  RoomExtendWarranty = "Room Extended Warranty",
  RoomMeetUp2ActiveCable = "Room MeetUp 2 Active Cable",
}
