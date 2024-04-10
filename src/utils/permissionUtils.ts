import { Configurator } from "../models/configurator/Configurator";
import { CountableMountElement } from "../models/permission/elements/mounts/CountableMountElement";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { ItemElement } from "../models/permission/elements/ItemElement";
import { MountElement } from "../models/permission/elements/mounts/MountElement";
import { ReferenceMountElement } from "../models/permission/elements/mounts/ReferenceMountElement";
import { Step } from "../models/permission/step/Step";
import { StepName } from "../models/permission/type";
import { getSeparatorItemColor } from "./baseUtils";

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
  RallyBarMini = "Logitech Rally Bar Mini",
  RallyBar = "Logitech Rally Bar",
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
  RallyMicPod = "Logitech Rally Mic Pod",
  RallyMicPodMount = "Logitech Rally Mic Pod Mount",
  RallyMicPodPendantMount = "Logitech Rally Mic Pod Pendant Mount",
  RallySpeaker = "Rally Speaker",
  RallyMicPodHub = "Rally Mic Pod Hub",
  CATCoupler = "Logitech Rally Mic Pod CAT Coupler",
  MicPodExtensionCable = "Mic Pod Extension Cable",
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP",
  LogitechTap = "Logitech Tap",

  TapWallMount = "Tap Mount - Wall Mount",
  TapRiserMount = "Tap Mount - Riser Mount",
  TapTableMount = "Tap Mount - Table Mount",
}

export enum VideoAccessoryName {
  LogitechTapScheduler = "Logitech Tap Scheduler",
  LogitechTapSchedulerAngleMount = "Logitech Tap Scheduler Angle Mount",
  LogitechTapSchedulerSideMount = "Logitech Tap Scheduler Side Mount",
  LogitechScribe = "Logitech Scribe",
  LogitechSwytch = "Logitech Swytch",
  LogitechExtend = "Logitech Extend",
  LogitechUSBaToHDMIAdapter = "Logitech USB-A to HDMI Adapter (NITRO)",
}

export enum SoftwareServicesName {
  LogitechSync = "Logitech Sync",
  SupportService = "Support Service",
  ExtendedWarranty = "Logitech Extended Warranty",
}

export function createStepRoomSize() {
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

export function createStepPlatform() {
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

export function createStepServices() {
  const stepServices = new Step(StepName.Services);
  const group = new GroupElement()
    .addElement(new ItemElement(ServiceName.Android))
    .addElement(new ItemElement(ServiceName.PC))
    .setRequiredOne(true);
  stepServices.allElements = [group];
  return stepServices;
}

export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  const setMountForCamera = (item: ItemElement) => {
    return item
      .addDependenceMount(
        new MountElement(
          CameraName.WallMountForVideoBars,
          Configurator.getNameNodeForCamera("Wall", 1)
        ).setDependentMount(
          new MountElement(
            CameraName.WallMountForVideoBars,
            Configurator.getNameNodeCameraWallMount()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          CameraName.TVMountForVideoBars,
          Configurator.getNameNodeForCamera("TV", 2)
        ).setDependentMount(
          new MountElement(
            CameraName.TVMountForVideoBars,
            Configurator.getNameNodeCameraTVMount()
          )
        )
      )
      .setDefaultMount(
        new MountElement(
          CameraName.WallMountForVideoBars,
          Configurator.getNameNodeForCamera("Wall", 1)
        ).setDependentMount(
          new MountElement(
            CameraName.WallMountForVideoBars,
            Configurator.getNameNodeCameraWallMount()
          )
        )
      );
  };
  const group = new GroupElement()
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBar)))
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBarMini)))
    .setRequiredOne(true);

  const groupCompute = new GroupElement()
    .addElement(
      new ItemElement(CameraName.PreConfiguredMiniPC)
        .setVisible(false)
        .setRequired(true)
    )
    .addElement(
      new ItemElement(CameraName.ComputeMount).addDependence(
        new ItemElement(ServiceName.PC)
      )
    );

  const groupSight = new GroupElement().addElement(
    new ItemElement(CameraName.LogitechSight).setDefaultMount(
      new MountElement(
        CameraName.LogitechSight,
        Configurator.getNameNodeForMic(3)
      )
    )
  );

  stepConferenceCamera.allElements = [group, groupCompute, groupSight];
  return stepConferenceCamera;
}

export function createStepAudioExtensions() {
  const stepAudioExtensions = new Step(StepName.AudioExtensions);
  const group = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPod)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPod,
          Configurator.getNameNodeForMic()
        )
      )
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodMount]: ["color", "count"],
        [AudioExtensionName.RallyMicPodPendantMount]: ["count"],
      })
      .addReservationMount({
        [CameraName.LogitechSight]: [3],
      })
  );
  const group2 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodMount)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPodMount,
          Configurator.getNameNodeForMic()
        ).setDependentMount(
          new ReferenceMountElement(
            AudioExtensionName.RallyMicPod,
            Configurator.getNameNodeMicPodMount()
          )
        )
      )
      .setDisabledColor(true)
      .addDisabledCounterDependence({
        [AudioExtensionName.RallyMicPodPendantMount]: {
          active: false,
        },
      })
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodPendantMount]: ["count"],
      })
      .addReservationMount({
        [CameraName.LogitechSight]: [3],
      })
  );
  const group3 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodPendantMount)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPodPendantMount,
          Configurator.getNameNodePendantMount()
        ).setDependentMount(
          new ReferenceMountElement(
            AudioExtensionName.RallyMicPod,
            Configurator.getNameNodePodPendantMount()
          )
        )
      )
      .addDisabledCounterDependence({
        [AudioExtensionName.RallyMicPodMount]: {
          active: false,
        },
      })
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodMount]: ["count"],
      })
  );
  const group4 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallySpeaker)
  );
  const group5 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodHub).addRequiredDependence({
      [AudioExtensionName.RallyMicPod]: {
        active: true,
        property: {
          count: 2,
        },
      },
      [AudioExtensionName.RallyMicPodMount]: {
        active: false,
      },
      [CameraName.RallyBarMini]: {
        active: true,
      },
    })
  );
  const group6 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.CATCoupler)
  );
  const group7 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.MicPodExtensionCable)
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

export function createStepMeetingController() {
  const stepMeetingController = new Step(StepName.MeetingController);
  const setMountForTap = (item: ItemElement) => {
    return item
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapWallMount,
          Configurator.getNameNodeForTap("Wall", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapWallMount,
            Configurator.getNameNodeForTap("Wall", 1)
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapRiserMount,
          Configurator.getNameNodeForTap("Table", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapRiserMount,
            Configurator.getNameNodeTapRiserMount()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapTableMount,
          Configurator.getNameNodeForTap("Table", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapTableMount,
            Configurator.getNameNodeTapTableMount()
          )
        )
      )
      .setDefaultMount(
        new MountElement(item.name, Configurator.getNameNodeForTap("Table", 1))
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

export function createStepVideoAccessories() {
  const stepVideoAccessories = new Step(StepName.VideoAccessories);

  const groupScheduler = new GroupElement().addElement(
    new ItemElement(VideoAccessoryName.LogitechTapScheduler)
      .setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechTapSchedulerSideMount,
          Configurator.getNameNodeScheduler()
        ).setDependentMount(
          new MountElement(
            VideoAccessoryName.LogitechTapSchedulerSideMount,
            Configurator.getNameNodeSideMountScheduler()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          VideoAccessoryName.LogitechTapSchedulerAngleMount,
          Configurator.getNameNodeScheduler()
        )
          .setDependentMount(
            new MountElement(
              VideoAccessoryName.LogitechTapSchedulerAngleMount,
              Configurator.getNameNodeAngleMountScheduler()
            )
          )
          .setDisabledColor(true)
      )
      .addAutoChangeItems({
        [VideoAccessoryName.LogitechTapSchedulerAngleMount]: ["color"],
        [VideoAccessoryName.LogitechTapSchedulerSideMount]: ["color"],
      })
  );

  const group = new GroupElement()
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
    )
    .addElement(new ItemElement(VideoAccessoryName.LogitechExtend))
    .addElement(new ItemElement(VideoAccessoryName.LogitechUSBaToHDMIAdapter));

  stepVideoAccessories.allElements = [groupScheduler, group];
  return stepVideoAccessories;
}

export function createStepSoftwareServices() {
  const stepSoftwareServices = new Step(StepName.SoftwareServices);
  const group = new GroupElement()
    .addElement(new ItemElement(SoftwareServicesName.LogitechSync))
    .addElement(new ItemElement(SoftwareServicesName.SupportService))
    .addElement(new ItemElement(SoftwareServicesName.ExtendedWarranty));
  group.setRequiredOne(true);
  stepSoftwareServices.allElements = [group];
  return stepSoftwareServices;
}

export const getPermissionNameByItemName = (
  threekitItemName: string
): string | undefined => {
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

  const isItemNameMatching =
    (threekitItemName_local: string) => (permissionName: string) =>
      threekitItemName_local.toLowerCase() === permissionName.toLowerCase();

  const isColorItemNameMatching =
    (threekitItemName_local: string) => (permissionName: string) => {
      const separatorItemColor = getSeparatorItemColor();

      const isIncludeSeparator = threekitItemName_local
        .toLowerCase()
        .includes(separatorItemColor);
      if (!isIncludeSeparator) return false;

      const [nameItem] = threekitItemName_local.split(separatorItemColor);

      return isItemNameMatching(nameItem)(permissionName);
    };

  return permissionNames.find(
    (permissionName) =>
      isItemNameMatching(threekitItemName)(permissionName) ||
      isColorItemNameMatching(threekitItemName)(permissionName)
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

export const isSupportService = (name: string) => {
  return isCompareName(name)([SoftwareServicesName.SupportService]);
};

function isCompareName(name: string) {
  return (arrayNames: Array<string>) => {
    return arrayNames.some((item) => item.toLowerCase() === name.toLowerCase());
  };
}
