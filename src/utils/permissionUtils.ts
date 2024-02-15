import { Permission } from "../models/permission/Permission";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { ItemElement } from "../models/permission/elements/ItemElement";
import { Step } from "../models/permission/step/Step";
import { StepName } from "../models/permission/type";

export const initPermission = () => {
  const permission = new Permission();
  permission.addStep(createStepPlatform());
  permission.addStep(createStepRoomSize());
  permission.addStep(createStepServices());
  permission.addStep(createStepConferenceCamera());
  permission.addStep(createStepAudioExtensions());
  permission.addStep(createStepMeetingController());
  permission.addStep(createStepVideoAccessories());
  permission.addStep(createStepSoftwareServices());

  global["permission"] = permission;
};

export enum PlatformName {
  GoogleMeet = "Google Meet",
  MicrosoftTeams = "Microsoft Teams",
  Zoom = "Zoom",
}

export enum RoomSizeName {
  Phonebooth = "Phonebooth",
  Huddle = "Huddle",
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  Auditorium = "Auditorium",
}

export enum ServiceName {
  Android = "Android",
  PC = "PC",
}

export enum CameraName {
  RallyBarHuddle = "Rally Bar Huddle",
  PreConfiguredMiniPC = "Pre-Configured Mini PC",
  MeetUp = "MeetUp",
  RoomMate = "RoomMate",
  RallyBarMini = "Logitech Rally Bar Mini",
  RallyBar = "Logitech Rally Bar",
  RallyPlus = "Rally Plus",
}

export enum AudioExtensionName {
  RallyMicPod = "Rally Mic Pod",
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP",
  LogitechTap = "Logitech Tap",
  LogitechSight = "Logitech Sight",
  LogitechTapScheduler = "Logitech Tap Scheduler",
  LogitechScribe = "Logitech Scribe",
  LogitechSwytch = "Logitech Swytch",
}

export enum VideoAccessoryName {
  ComputeMount = "Compute Mount",
  WallMount = "Tap Mount - Wall Mount",
  RiserMount = "Tap Mount - Riser Mount",
  TableMount = "Tap Mount - Table Mount",
  WallMountForVideoBars = "Wall Mount for Video Bars",
  TVMountForVideoBars = "TV Mount for Video Bars",
  RallyMicPodMount = "Logitech Rally Mic Pod Mount",
  RallyMicPodHub = "Rally Mic Pod Hub",
  MicPodExtensionCable = "Mic Pod Extension Cable",
}

export enum SoftwareServicesName {
  LogitechSync = "Logitech Sync",
  SupportService = "Support Service",
}

function createStepPlatform() {
  const stepPlatform = new Step(StepName.Platform);
  const group = new GroupElement()
    .addElement(new ItemElement(PlatformName.GoogleMeet))
    .addElement(new ItemElement(PlatformName.MicrosoftTeams))
    .addElement(new ItemElement(PlatformName.Zoom))
    .setRequiredOne(true);
  stepPlatform.allElements = [group];
  return stepPlatform;
}

function createStepRoomSize() {
  const stepRoomSize = new Step(StepName.RoomSize);
  const group = new GroupElement()
    .addElement(new ItemElement(RoomSizeName.Phonebooth))
    .addElement(new ItemElement(RoomSizeName.Huddle))
    .addElement(new ItemElement(RoomSizeName.Small))
    .addElement(new ItemElement(RoomSizeName.Medium))
    .addElement(new ItemElement(RoomSizeName.Large))
    .addElement(
      new ItemElement(RoomSizeName.Auditorium).addDependence([
        new ItemElement(PlatformName.MicrosoftTeams),
        new ItemElement(PlatformName.Zoom),
      ])
    )
    .setRequiredOne(true);
  stepRoomSize.allElements = [group];
  return stepRoomSize;
}

function createStepServices() {
  const stepServices = new Step(StepName.Services);
  const group = new GroupElement()
    .addElement(new ItemElement(ServiceName.Android))
    .addElement(new ItemElement(ServiceName.PC))
    .setRequiredOne(true);
  stepServices.allElements = [group];
  return stepServices;
}

function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  const group = new GroupElement()
    .addElement(
      new ItemElement(CameraName.RallyBar).addDependence(
        new ItemElement(RoomSizeName.Medium)
      )
    )
    .addElement(
      new ItemElement(CameraName.RallyBarMini).addDependence(
        new ItemElement(RoomSizeName.Medium)
      )
    )
    .addElement(
      new ItemElement(CameraName.PreConfiguredMiniPC)
        .addDependence(new ItemElement(ServiceName.PC))
        .addDependence(new ItemElement(RoomSizeName.Medium))
        .setVisible(false)
        .setRequired(true)
        .setDefaultActive(true)
    )
    .setRequiredOne(true);
  stepConferenceCamera.allElements = [group];
  return stepConferenceCamera;
}

function createStepAudioExtensions() {
  const stepAudioExtensions = new Step(StepName.AudioExtensions);
  const group = new GroupElement()
    .addElement(
      new ItemElement(AudioExtensionName.RallyMicPod).addDependence(
        new ItemElement(CameraName.RallyBar)
      )
    )
    .addElement(
      new ItemElement(AudioExtensionName.RallyMicPod)
        .addDependence(new ItemElement(CameraName.RallyBarMini))
        .setDefaultActive(true)
        .setRecommended(true)
    );
  stepAudioExtensions.allElements = [group];
  return stepAudioExtensions;
}

function createStepMeetingController() {
  const stepMeetingController = new Step(StepName.MeetingController);
  const group1 = new GroupElement()
    .addElement(
      new ItemElement(MeetingControllerName.LogitechTapIP).addDependence(
        new ItemElement(ServiceName.Android)
      )
    )
    .addElement(
      new ItemElement(MeetingControllerName.LogitechTap).addDependence([
        new ItemElement(ServiceName.Android),
        new ItemElement(ServiceName.PC),
      ])
    )
    .setRequiredOne(true);

  const group2 = new GroupElement()
    .addElement(new ItemElement(MeetingControllerName.LogitechSight))
    .addElement(new ItemElement(MeetingControllerName.LogitechTapScheduler))
    .addElement(
      new ItemElement(MeetingControllerName.LogitechScribe).addDependence(
        new ItemElement(ServiceName.Android)
      )
    )
    .addElement(new ItemElement(MeetingControllerName.LogitechSwytch));
  stepMeetingController.allElements = [group1, group2];
  return stepMeetingController;
}

function createStepVideoAccessories() {
  const stepVideoAccessories = new Step(StepName.VideoAccessories);
  const group = new GroupElement()
    .addElement(new ItemElement(VideoAccessoryName.ComputeMount))
    .addElement(new ItemElement(VideoAccessoryName.WallMount))
    .addElement(new ItemElement(VideoAccessoryName.RiserMount))
    .addElement(new ItemElement(VideoAccessoryName.TableMount))
    .addElement(new ItemElement(VideoAccessoryName.WallMountForVideoBars))
    .addElement(new ItemElement(VideoAccessoryName.TVMountForVideoBars))
    .addElement(
      new ItemElement(VideoAccessoryName.RallyMicPodMount)
        .addDependence(new ItemElement(AudioExtensionName.RallyMicPod))
        .setDefaultActive(true)
    )
    .addElement(new ItemElement(VideoAccessoryName.RallyMicPodHub))
    .addElement(
      new ItemElement(VideoAccessoryName.MicPodExtensionCable)
        .addDependence(new ItemElement(AudioExtensionName.RallyMicPod))
        .setDefaultActive(true)
        .setRecommended(true)
    );
  stepVideoAccessories.allElements = [group];
  return stepVideoAccessories;
}

function createStepSoftwareServices() {
  const stepSoftwareServices = new Step(StepName.SoftwareServices);
  const group = new GroupElement()
    .addElement(new ItemElement(SoftwareServicesName.LogitechSync))
    .addElement(new ItemElement(SoftwareServicesName.SupportService));
  stepSoftwareServices.allElements = [group];
  return stepSoftwareServices;
}

export const getPermissionNameByItemName = (itemName: string) => {
  const permissionNames = [
    ...Object.values(PlatformName),
    ...Object.values(RoomSizeName),
    ...Object.values(ServiceName),
    ...Object.values(CameraName),
    ...Object.values(AudioExtensionName),
    ...Object.values(MeetingControllerName),
    ...Object.values(VideoAccessoryName),
    ...Object.values(SoftwareServicesName),
  ];

  return permissionNames.find(
    (name) => itemName.toLowerCase() === name.toLowerCase()
  );
};

export const isCamera = (name: string) => {
  return isCompareName(name)([
    // CameraName.RallyBar,
    CameraName.RallyBarMini,
  ]);
};

export const isMic = (name: string) => {
  return isCompareName(name)([AudioExtensionName.RallyMicPod]);
};

export const isTap = (name: string) => {
  return isCompareName(name)([
    MeetingControllerName.LogitechTapIP,
    MeetingControllerName.LogitechTap,
  ]);
};

function isCompareName(name: string) {
  return (arrayNames: Array<string>) => {
    return arrayNames.some((item) => item.toLowerCase() === name.toLowerCase());
  };
}
