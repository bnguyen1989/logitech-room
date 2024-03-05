import { Configurator } from "../models/configurator/Configurator";
import { Permission } from "../models/permission/Permission";
import { CountableMountElement } from "../models/permission/elements/CountableMountElement";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { ItemElement } from "../models/permission/elements/ItemElement";
import { MountElement } from "../models/permission/elements/MountElement";
import { Step } from "../models/permission/step/Step";
import { StepName } from "../models/permission/type";

export const initPermission = () => {
  const permission = new Permission();
  permission.addStep(createStepRoomSize());
  permission.addStep(createStepPlatform());
  permission.addStep(createStepServices());
  permission.addStep(createStepConferenceCamera());
  permission.addStep(createStepAudioExtensions());
  permission.addStep(createStepMeetingController());
  permission.addStep(createStepVideoAccessories());
  permission.addStep(createStepSoftwareServices());

  global["permission"] = permission;
};

export enum RoomSizeName {
  Phonebooth = "Phonebooth",
  Huddle = "Huddle",
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  Auditorium = "Auditorium",
}

export enum PlatformName {
  GoogleMeet = "Google Meet",
  MicrosoftTeams = "Microsoft Teams",
  Zoom = "Zoom",
}

export enum ServiceName {
  Android = "Appliance",
  PC = "PC based",
}

export enum CameraName {
  MeetUp = "MeetUp",
  RallyBarHuddle = "Logitech Rally Bar Huddle",
  RallyBarMini = "Logitech Rally Bar Mini - Graphite",
  RallyBar = "Logitech Rally Bar - Graphite",
  RallyPlus = "Logitech Rally Plus",

  AddCameras = "Add'l Cameras",

  PreConfiguredMiniPC = "Pre-Configured Mini PC",
  RoomMate = "RoomMate",

  TVMountForMeetUP = "TV Mount for MeetUp",
  TVMountForVideoBars = "TV Mount for Video Bars",
  WallMountForVideoBars = "Wall Mount for Video Bars",
  RallyMountingKit = "Rally Mounting Kit",

  ComputeMount = "Compute Mount",

  LogitechSight = "Logitech Sight",
}

export enum AudioExtensionName {
  RallyMicPod = "Logitech Rally Mic Pod - Graphite",
  RallyMicPodMount = "Logitech Rally Mic Pod Mount - Graphite",
  RallyMicPodPendantMount = "Logitech Rally Mic Pod Pendant Mount",
  RallySpeaker = "Rally Speaker",
  RallyMicPodHub = "Rally Mic Pod Hub",
  CATCoupler = "CAT Coupler",
  MicPodExtensionCable = "Mic Pod Extension Cable",
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP - Graphite",
  LogitechTap = "Logitech Tap",

  TapWallMount = "Tap Mount - Wall Mount",
  TapRiserMount = "Tap Mount - Riser Mount",
  TapTableMount = "Tap Mount - Table Mount",
}

export enum VideoAccessoryName {
  LogitechTapScheduler = "Logitech Tap Scheduler - Graphite",
  LogitechScribe = "Logitech Scribe",
  LogitechSwytch = "Logitech Swytch",
}

export enum SoftwareServicesName {
  LogitechSync = "Logitech Sync",
  SupportService = "Support Service",
}

function createStepRoomSize() {
  const stepRoomSize = new Step(StepName.RoomSize);
  const group = new GroupElement()
    .addElement(new ItemElement(RoomSizeName.Phonebooth))
    .addElement(new ItemElement(RoomSizeName.Huddle))
    .addElement(new ItemElement(RoomSizeName.Small))
    .addElement(new ItemElement(RoomSizeName.Medium))
    .addElement(new ItemElement(RoomSizeName.Large))
    .addElement(new ItemElement(RoomSizeName.Auditorium))
    .setRequiredOne(true);

  stepRoomSize.allElements = [group];
  return stepRoomSize;
}

function createStepPlatform() {
  const stepPlatform = new Step(StepName.Platform);
  const group = new GroupElement()
    .addElement(
      new ItemElement(PlatformName.GoogleMeet).addDependence([
        new ItemElement(RoomSizeName.Phonebooth),
        new ItemElement(RoomSizeName.Huddle),
        new ItemElement(RoomSizeName.Small),
        new ItemElement(RoomSizeName.Medium),
        new ItemElement(RoomSizeName.Large),
      ])
    )
    .addElement(new ItemElement(PlatformName.MicrosoftTeams))
    .addElement(new ItemElement(PlatformName.Zoom))
    .setRequiredOne(true);
  stepPlatform.allElements = [group];
  return stepPlatform;
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
  const setMountForCamera = (item: ItemElement) => {
    return item
      .addDependenceMount(
        new MountElement(
          CameraName.WallMountForVideoBars,
          Configurator.getNameNodeForCamera("Wall")
        )
      )
      .addDependenceMount(
        new MountElement(
          CameraName.TVMountForVideoBars,
          Configurator.getNameNodeForCamera("TV", 2)
        )
      )
      .setDefaultMount(
        new MountElement(
          CameraName.RallyBarMini,
          Configurator.getNameNodeForCamera("TV", 1)
        )
      );
  };
  const group = new GroupElement()
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBar)))
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBarMini)))
    .addElement(
      new ItemElement(CameraName.PreConfiguredMiniPC)
        .setVisible(false)
        .setRequired(true)
    )
    .addElement(
      new ItemElement(CameraName.ComputeMount)
        .setVisible(false)
        .setRequired(true)
    )
    .setRequiredOne(true);

  const groupSight = new GroupElement().addElement(
    new ItemElement(CameraName.LogitechSight).setDefaultMount(
      new MountElement(
        CameraName.LogitechSight,
        Configurator.getNameNodeForMic(3)
      )
    )
  );

  stepConferenceCamera.allElements = [group, groupSight];
  return stepConferenceCamera;
}

function createStepAudioExtensions() {
  const stepAudioExtensions = new Step(StepName.AudioExtensions);
  const group = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPod)
      .addDependenceMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPod,
          "Mic_Placement"
        )
      )
      .setRecommended(true)
  );
  const group2 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodMount).addDependenceMount(
      new CountableMountElement(
        AudioExtensionName.RallyMicPodMount,
        "Mic_Placement"
      )
    )
  );
  const group3 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodPendantMount)
  );
  const group4 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallySpeaker)
  );
  const group5 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodHub)
  );
  const group6 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.CATCoupler)
  );
  const group7 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.MicPodExtensionCable).setRecommended(
      true
    )
  );

  stepAudioExtensions.allElements = [
    group,
    group2,
    group3,
    group4,
    group5,
    group6,
    group7,
  ];
  return stepAudioExtensions;
}

function createStepMeetingController() {
  const stepMeetingController = new Step(StepName.MeetingController);
  const setMountForTap = (item: ItemElement) => {
    return item
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapWallMount,
          Configurator.getNameNodeForTap(1)
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapRiserMount,
          Configurator.getNameNodeForTap(2)
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapTableMount,
          Configurator.getNameNodeForTap(3)
        )
      )
      .setDefaultMount(
        new MountElement(
          MeetingControllerName.LogitechTapIP,
          Configurator.getNameNodeForTap(3)
        )
      );
  };
  const group1 = new GroupElement()
    .addElement(
      setMountForTap(new ItemElement(MeetingControllerName.LogitechTapIP))
    )
    .addElement(
      setMountForTap(new ItemElement(MeetingControllerName.LogitechTap))
    )
    .setRequiredOne(true);

  stepMeetingController.allElements = [group1];
  return stepMeetingController;
}

function createStepVideoAccessories() {
  const stepVideoAccessories = new Step(StepName.VideoAccessories);

  const group = new GroupElement()
    .addElement(
      new ItemElement(VideoAccessoryName.LogitechTapScheduler).setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechTapScheduler,
          Configurator.getNameNodeScheduler()
        )
      )
    )
    .addElement(
      new ItemElement(VideoAccessoryName.LogitechSwytch).setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechSwytch,
          Configurator.getNameNodeSwytch()
        )
      )
    )
    .addElement(
      new ItemElement(VideoAccessoryName.LogitechScribe).setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechScribe,
          Configurator.getNameNodeForScribe()
        )
      )
    );

  stepVideoAccessories.allElements = [group];
  return stepVideoAccessories;
}

function createStepSoftwareServices() {
  const stepSoftwareServices = new Step(StepName.SoftwareServices);
  const group = new GroupElement()
    .addElement(new ItemElement(SoftwareServicesName.LogitechSync))
    .addElement(new ItemElement(SoftwareServicesName.SupportService));
  group.setRequiredOne(true);
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
  return isCompareName(name)([CameraName.RallyBar, CameraName.RallyBarMini]);
};
export const isScribe = (name: string) => {
  return isCompareName(name)([VideoAccessoryName.LogitechScribe]);
};

export const isSight = (name: string) => {
  return isCompareName(name)([CameraName.LogitechSight]);
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

export const isCameraMount = (name: string) => {
  return isCompareName(name)([
    CameraName.WallMountForVideoBars,
    CameraName.TVMountForVideoBars,
  ]);
};

export const isTapMount = (name: string) => {
  return isCompareName(name)([
    MeetingControllerName.TapWallMount,
    MeetingControllerName.TapRiserMount,
    MeetingControllerName.TapTableMount,
  ]);
};

function isCompareName(name: string) {
  return (arrayNames: Array<string>) => {
    return arrayNames.some((item) => item.toLowerCase() === name.toLowerCase());
  };
}
