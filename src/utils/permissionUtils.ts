import { CountableMountElement } from "../models/permission/elements/mounts/CountableMountElement";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { ItemElement } from "../models/permission/elements/ItemElement";
import { MountElement } from "../models/permission/elements/mounts/MountElement";
import { ReferenceMountElement } from "../models/permission/elements/mounts/ReferenceMountElement";
import { Step } from "../models/permission/step/Step";
import { StepName, getSeparatorItemColor } from "./baseUtils";
import { PlacementManager } from "../models/configurator/PlacementManager";

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
  BYOD = "BYOD",
}

export enum ServiceName {
  Android = "Appliance",
  PC = "PC based",
}

export enum CameraName {
  MeetUp = "MeetUp",
  MeetUp2 = "Logitech MeetUp 2",
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

  MeetUp2ActiveCable = "Logitech MeetUp 2 Active Cable",
}

export enum AudioExtensionName {
  RallyMicPod = "Logitech Rally Mic Pod",
  RallyMicPodMount = "Logitech Rally Mic Pod Mount",
  RallyMicPodPendantMount = "Logitech Rally Mic Pod Pendant Mount",
  RallySpeaker = "Rally Speaker",
  RallyMicPodHub = "Rally Mic Pod Hub",
  CATCoupler = "Logitech Rally Mic Pod CAT Coupler",
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP",
  LogitechTap = "Logitech Tap",

  TapWallMount = "Tap Mount - Wall Mount",
  TapRiserMount = "Tap Mount - Riser Mount",
  TapTableMount = "Tap Mount - Table Mount",

  RallyBarTapIP = "Rally Bar + Tap IP",
  RallyBarMiniTapIP = "Rally Bar Mini + Tap IP",
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
    .addElement(new ItemElement(PlatformName.GoogleMeet))
    .addElement(new ItemElement(PlatformName.MicrosoftTeams))
    .addElement(new ItemElement(PlatformName.Zoom))
    .addElement(new ItemElement(PlatformName.BYOD).setSecondary(true))
    .setRequiredOne(true);
  stepPlatform.allElements = [group];
  return stepPlatform;
}

export function createStepServices() {
  const stepServices = new Step(StepName.Services).addAvailableDependence({
    [PlatformName.BYOD]: {
      active: false,
    },
  });
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
          PlacementManager.getNameNodeForCamera("Wall", 1)
        ).setDependentMount(
          new MountElement(
            CameraName.WallMountForVideoBars,
            PlacementManager.getNameNodeCameraWallMount()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          CameraName.TVMountForVideoBars,
          PlacementManager.getNameNodeForCamera("TV", 2)
        ).setDependentMount(
          new MountElement(
            CameraName.TVMountForVideoBars,
            PlacementManager.getNameNodeCameraTVMount()
          )
        )
      )
      .setDefaultMount(
        new MountElement(
          item.name,
          PlacementManager.getNameNodeCommodeForCamera("RallyBar")
        )
      );
  };
  const group = new GroupElement()
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBar)))
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBarMini)))
    .addElement(
      new ItemElement(CameraName.MeetUp2).setDefaultMount(
        new MountElement(
          CameraName.MeetUp2,
          PlacementManager.getNameNodeForCamera("TV", 2)
        )
      )
    )
    .addElement(
      new ItemElement(CameraName.RallyBarHuddle).setDefaultMount(
        new MountElement(
          CameraName.RallyBarHuddle,
          PlacementManager.getNameNodeForCamera("TV", 2)
        )
      )
    )
    .addElement(new ItemElement(CameraName.RallyPlus))
    .setRequiredOne(true);

  const tempGroupMount = new GroupElement()
    .addElement(
      new ItemElement(CameraName.TVMountForMeetUP).addDependence([
        new ItemElement(RoomSizeName.Phonebooth),
        new ItemElement(RoomSizeName.Huddle),
      ])
    )
    .addElement(
      new ItemElement(CameraName.RallyMountingKit).addDependence([
        new ItemElement(RoomSizeName.Phonebooth),
        new ItemElement(RoomSizeName.Huddle),
      ])
    );

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
        PlacementManager.getNameNodeForMic(3)
      )
    )
  );

  const groupMeetUp2ActiveCable = new GroupElement().addElement(
    new ItemElement(CameraName.MeetUp2ActiveCable)
  );

  stepConferenceCamera.allElements = [
    group,
    groupCompute,
    tempGroupMount,
    groupSight,
    groupMeetUp2ActiveCable,
  ];
  return stepConferenceCamera;
}

export function createStepAudioExtensions() {
  const stepAudioExtensions = new Step(
    StepName.AudioExtensions
  ).addAvailableDependence({
    [RoomSizeName.Phonebooth]: {
      active: false,
    },
    [RoomSizeName.Huddle]: {
      active: false,
    },
  });
  const group = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPod)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPod,
          PlacementManager.getNameNodeForMic()
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
          PlacementManager.getNameNodeForMic()
        ).setDependentMount(
          new ReferenceMountElement(
            AudioExtensionName.RallyMicPod,
            PlacementManager.getNameNodeMicPodMount()
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
          PlacementManager.getNameNodePendantMount()
        ).setDependentMount(
          new ReferenceMountElement(
            AudioExtensionName.RallyMicPod,
            PlacementManager.getNameNodePodPendantMount()
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
    new ItemElement(AudioExtensionName.RallyMicPodHub)
  );
  const group6 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.CATCoupler)
  );

  stepAudioExtensions.allElements = [
    group,
    group2,
    group3,
    group4,
    group5,
    group6,
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
          PlacementManager.getNameNodeForTap("Wall", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapWallMount,
            PlacementManager.getNameNodeForTap("Wall", 1)
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapRiserMount,
          PlacementManager.getNameNodeForTap("Table", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapRiserMount,
            PlacementManager.getNameNodeTapRiserMount()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapTableMount,
          PlacementManager.getNameNodeForTap("Table", 1)
        ).setDependentMount(
          new MountElement(
            MeetingControllerName.TapTableMount,
            PlacementManager.getNameNodeTapTableMount()
          )
        )
      )
      .setDefaultMount(
        new MountElement(
          item.name,
          PlacementManager.getNameNodeForTap("Table", 1)
        )
      );
  };
  const groupTap = new GroupElement()
    .addElement(
      setMountForTap(new ItemElement(MeetingControllerName.LogitechTapIP))
    )
    .addElement(
      setMountForTap(new ItemElement(MeetingControllerName.LogitechTap))
    )
    .setRequiredOne(true);

  const groupBundle = new GroupElement()
    .addElement(
      new ItemElement(MeetingControllerName.RallyBarTapIP).setVisible(false)
    )
    .addElement(
      new ItemElement(MeetingControllerName.RallyBarMiniTapIP).setVisible(false)
    );

  stepMeetingController.allElements = [groupTap, groupBundle];
  return stepMeetingController;
}

export function createStepVideoAccessories() {
  const stepVideoAccessories = new Step(StepName.VideoAccessories);

  const groupScheduler = new GroupElement().addElement(
    new ItemElement(VideoAccessoryName.LogitechTapScheduler)
      .setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechTapSchedulerSideMount,
          PlacementManager.getNameNodeScheduler()
        ).setDependentMount(
          new MountElement(
            VideoAccessoryName.LogitechTapSchedulerSideMount,
            PlacementManager.getNameNodeSideMountScheduler()
          )
        )
      )
      .addDependenceMount(
        new MountElement(
          VideoAccessoryName.LogitechTapSchedulerAngleMount,
          PlacementManager.getNameNodeScheduler()
        )
          .setDependentMount(
            new MountElement(
              VideoAccessoryName.LogitechTapSchedulerAngleMount,
              PlacementManager.getNameNodeAngleMountScheduler()
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
          PlacementManager.getNameNodeSwytch()
        )
      )
    )
    .addElement(
      new ItemElement(VideoAccessoryName.LogitechScribe).setDefaultMount(
        new MountElement(
          VideoAccessoryName.LogitechScribe,
          PlacementManager.getNameNodeForScribe()
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

export const isTapElement = (name: string) => {
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

export const isBundleElement = (name: string) => {
  return isCompareName(name)([
    MeetingControllerName.RallyBarTapIP,
    MeetingControllerName.RallyBarMiniTapIP,
  ]);
};

export const isCameraElement = (name: string) => {
  return isCompareName(name)([
    CameraName.MeetUp2,
    CameraName.RallyBarHuddle,
    CameraName.RallyBarMini,
    CameraName.RallyBar,
    CameraName.RallyPlus,
  ]);
};

function isCompareName(name: string) {
  return (arrayNames: Array<string>) => {
    return arrayNames.some((item) => item.toLowerCase() === name.toLowerCase());
  };
}
