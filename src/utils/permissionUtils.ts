import { CountableMountElement } from "../models/permission/elements/mounts/CountableMountElement";
import { GroupElement } from "../models/permission/elements/GroupElement";
import { ItemElement } from "../models/permission/elements/ItemElement";
import { MountElement } from "../models/permission/elements/mounts/MountElement";
import { ReferenceMountElement } from "../models/permission/elements/mounts/ReferenceMountElement";
import { Step } from "../models/permission/step/Step";
import { StepName, getSeparatorItem } from "./baseUtils";
import { PlacementManager } from "../models/configurator/PlacementManager";
import { AttributeMountElement } from "../models/permission/elements/mounts/AttributeMountElement";
import { RuleManagerMount } from "../models/configurator/RuleManagerMount";
import { RuleBuilder } from "../models/configurator/RuleBuilder";
import { Condition } from "../models/permission/conditions/Condition";
import { ConditionPropertyName } from "../models/permission/conditions/type";
import { ConditionChangeBuilder } from "../models/permission/conditions/ConditionChangeBuilder";

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
  MeetUp2 = "Logitech MeetUp 2",
  RallyBarHuddle = "Logitech Rally Bar Huddle",
  RallyBarMini = "Logitech Rally Bar Mini",
  RallyBar = "Logitech Rally Bar",
  RallyPlus = "Logitech Rally Plus",
  RallyCamera = "Logitech Rally Camera",

  AddCameras = "Add'l Cameras",

  PreConfiguredMiniPC = "Pre-Configured Mini PC",
  RoomMate = "Logitech RoomMate",

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
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP",
  LogitechTap = "Logitech Tap",

  TapWallMount = "Tap Mount - Wall Mount",
  TapRiserMount = "Tap Mount - Riser Mount",
  TapTableMount = "Tap Mount - Table Mount",

  RallyBarTapIP = "Rally Bar + Tap IP",
  RallyBarMiniTapIP = "Rally Bar Mini + Tap IP",
  RallyBarHuddleTapIP = "Rally Bar Huddle + Tap IP",
}

export enum VideoAccessoryName {
  LogitechTapScheduler = "Logitech Tap Scheduler",
  LogitechTapSchedulerAngleMount = "Logitech Tap Scheduler Angle Mount",
  LogitechTapSchedulerSideMount = "Logitech Tap Scheduler Side Mount",
  LogitechScribe = "Logitech Scribe",
  LogitechSwytch = "Logitech Swytch",
  LogitechExtend = "Logitech Extend",
  LogitechUSBaToHDMIAdapter = "Logitech USB-A to HDMI Adapter (NITRO)",
  MeetUp2ActiveCable = "Logitech MeetUp 2 Active Cable",
}

export enum SoftwareServicesName {
  LogitechSync = "Logitech Sync",
  SupportService = "Support Service",
  ExtendedWarranty = "Logitech Extended Warranty",
  EssentialServicePlan = "Essential Service Plan",
}

export enum TVName {
  LogitechTVOne = "Logitech TV One",
  LogitechTVTwo = "Logitech TV Two",
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
    return (
      item
        .addDependenceMount(
          new MountElement(
            CameraName.WallMountForVideoBars,
            PlacementManager.getNameNodeForCamera("Wall", 1, 2)
          )
          // .setDependentMount(
          //   new MountElement(
          //     CameraName.WallMountForVideoBars,
          //     PlacementManager.getNameNodeCameraWallMount()
          //   )
          // )
          .addRecommendedDisplay(TVName.LogitechTVOne, true)
        )
        .addDependenceMount(
          new MountElement(
            CameraName.TVMountForVideoBars,
            PlacementManager.getNameNodeForCamera("TV", 1, 2)
          )
          // .setDependentMount(
          //   new MountElement(
          //     CameraName.TVMountForVideoBars,
          //     PlacementManager.getNameNodeCameraTVMount()
          //   )
          // )
          .addRecommendedDisplay(TVName.LogitechTVTwo, true)
        )
        .setDefaultMount(
          new MountElement(
            item.name,
            PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2)
          )
        )
        .setAccessoryItems([
          CameraName.WallMountForVideoBars,
          CameraName.TVMountForVideoBars,
        ])
        // .addBundleMount(
        //   new MountElement(
        //     TVName.LogitechTVTwo,
        //     PlacementManager.getNameNodeForTV()
        //   )
        // )
        // .addBundleMount(
        //   new MountElement(
        //     TVName.LogitechTVOne,
        //     PlacementManager.getNameNodeForTV()
        //   )
        // )
        // .addBundleMountsDependence(TVName.LogitechTVTwo, [
        //   PlatformName.GoogleMeet,
        //   PlatformName.MicrosoftTeams,
        //   PlatformName.Zoom,
        // ])
        // .addBundleMountsDependence(TVName.LogitechTVOne, [PlatformName.BYOD])
        .setHiddenDisplay(false)
    );
  };
  const group = new GroupElement()
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBar)))
    .addElement(setMountForCamera(new ItemElement(CameraName.RallyBarMini)))
    .addElement(
      new ItemElement(CameraName.MeetUp2)
        .setDefaultMount(
          new MountElement(
            CameraName.MeetUp2,
            PlacementManager.getNameNodeCommodeForCamera("Mini", 1)
          )
        )
        .addDependenceMount(
          new MountElement(
            CameraName.TVMountForMeetUP,
            PlacementManager.getNameNodeForCamera("TV", 1, 1)
          )
        )
        .setAccessoryItems([CameraName.TVMountForMeetUP])
        .addBundleMount(
          new MountElement(
            TVName.LogitechTVOne,
            PlacementManager.getNameNodeForTV()
          )
        )
    )
    .addElement(
      new ItemElement(CameraName.RallyBarHuddle)
        .setDefaultMount(
          new MountElement(
            CameraName.RallyBarHuddle,
            PlacementManager.getNameNodeCommodeForCamera("Huddle")
          )
        )
        .addDependenceMount(
          new MountElement(
            CameraName.TVMountForVideoBars,
            PlacementManager.getNameNodeForCamera("TV", 1, 1)
          )
        )
        .setAccessoryItems([CameraName.TVMountForVideoBars])
        .addBundleMount(
          new MountElement(
            TVName.LogitechTVOne,
            PlacementManager.getNameNodeForTV()
          )
        )
    )
    .addElement(
      new ItemElement(CameraName.RallyPlus)
        .setAccessoryItems([CameraName.RallyMountingKit])
        .setDefaultMount(
          new AttributeMountElement(
            CameraName.RallyPlus,
            PlacementManager.getNameNodeCameraRalyPlus()
          ).setAttributes({
            Position: true,
            Alternative_rally_plus: false,
            display: false,
          })
        )
        .addDependenceMount(
          new AttributeMountElement(
            CameraName.RallyMountingKit,
            PlacementManager.getNameNodeCameraRalyPlus()
          )
            .setAttributes({
              Position: false,
              Alternative_rally_plus: true,
              display: false,
            })
            .addRecommendedDisplay(TVName.LogitechTVTwo, true)
        )
        .addConditionAttributesMount({
          display: {
            [CameraName.RallyMountingKit]: {
              nameNodes: [PlatformName.BYOD],
              value: true,
            },
          },
        })
        .addAutoChangeItems({
          [AudioExtensionName.RallyMicPod]: ["color"],
          [AudioExtensionName.RallyMicPodMount]: ["color"],
        })
        // .addBundleMount(
        //   new MountElement(
        //     TVName.LogitechTVTwo,
        //     PlacementManager.getNameNodeForTV()
        //   )
        // )
        // .addBundleMount(
        //   new MountElement(
        //     TVName.LogitechTVOne,
        //     PlacementManager.getNameNodeForTV()
        //   )
        // )
        // .addBundleMountsDependence(TVName.LogitechTVTwo, [
        //   PlatformName.GoogleMeet,
        //   PlatformName.MicrosoftTeams,
        //   PlatformName.Zoom,
        // ])
        // .addBundleMountsDependence(TVName.LogitechTVOne, [PlatformName.BYOD])
        .addBundleMount(
          new CountableMountElement(
            AudioExtensionName.RallyMicPod,
            PlacementManager.getNameNodeForMic()
          )
            .setMin(0)
            .setMax(2)
            .setActiveIndex(2)
            .addConditionNameNode(
              new ConditionChangeBuilder()
                .setCondition(
                  new Condition(AudioExtensionName.RallyMicPod)
                    .addProperty(ConditionPropertyName.COUNT, 2)
                    .addDependentCondition(
                      new Condition(RoomSizeName.Large).addProperty(
                        ConditionPropertyName.ACTIVE,
                        true
                      )
                    )
                )
                .addChange(
                  "nodeName",
                  PlacementManager.getNameNodeForMicDouble()
                )
                .build()
            )
            .addConditionNameNode(
              new ConditionChangeBuilder()
                .setCondition(
                  new Condition(AudioExtensionName.RallyMicPod)
                    .addProperty(ConditionPropertyName.COUNT, 3)
                    .addDependentCondition(
                      new Condition(RoomSizeName.Large).addProperty(
                        ConditionPropertyName.ACTIVE,
                        true
                      )
                    )
                )
                .addChange("nodeName", PlacementManager.getNameNodeForMic())
                .build()
            )
        )
        .setHiddenDisplay(false)
    )
    .setRequiredOne(true);

  const groupRallyCamera = new GroupElement().addElement(
    new ItemElement(CameraName.RallyCamera).setDefaultMount(
      new CountableMountElement(
        CameraName.RallyCamera,
        PlacementManager.getNameNodeForCamera("Wall")
      )
        .setOffsetIndex(1)
        .setMountLogic([
          RuleManagerMount.createRuleObject({
            keyPermission: CameraName.RallyCamera,
            condition: RuleBuilder.newRule()
              .ruleFor("count")
              .equalTo(1)
              .build(),
            action: RuleManagerMount.generateActionAddNodesAndRemoveNodes({
              setNodes: PlacementManager.getNameNodeCameraRallyPlusBackWall(),
              remoteNodes: PlacementManager.getNameNodeCameraRallyPlusAboveTV(),
            }),
          }),
          RuleManagerMount.createRuleObject({
            keyPermission: CameraName.RallyCamera,
            condition: RuleBuilder.newRule()
              .ruleFor("count")
              .equalTo(2)
              .build(),
            action: RuleManagerMount.generateActionAddNodesAndRemoveNodes({
              setNodes: PlacementManager.getNameNodeCameraRallyPlusAboveTV(),
              remoteNodes:
                PlacementManager.getNameNodeCameraRallyPlusBackWall(),
            }),
          }),
        ])
    )
  );

  const groupCompute = new GroupElement()
    .addElement(
      new ItemElement(CameraName.PreConfiguredMiniPC)
        .setRequired(true)
        .setAccessoryItems([CameraName.ComputeMount])
        .addDependence("instruction-1", [
          new ItemElement(RoomSizeName.Phonebooth),
          new ItemElement(RoomSizeName.Huddle),
          new ItemElement(RoomSizeName.Small),
          new ItemElement(RoomSizeName.Medium),
        ])
        .addDependence("instruction-1", [new ItemElement(ServiceName.PC)])
        .addDependence("instruction-1", [
          new ItemElement(CameraName.MeetUp2),
          new ItemElement(CameraName.RallyBarHuddle),
          new ItemElement(CameraName.RallyBar),
          new ItemElement(CameraName.RallyBarMini),
        ])
        .addDependence("instruction-2", [
          new ItemElement(RoomSizeName.Large),
          new ItemElement(RoomSizeName.Auditorium),
        ])
        .addDependence("instruction-2", [new ItemElement(ServiceName.PC)])
        .addDependence("instruction-2", [
          new ItemElement(CameraName.RallyBar),
          new ItemElement(CameraName.RallyPlus),
        ])
    )
    .addElement(
      new ItemElement(CameraName.ComputeMount)
        .addDependence("instruction-1", [
          new ItemElement(RoomSizeName.Phonebooth),
          new ItemElement(RoomSizeName.Huddle),
          new ItemElement(RoomSizeName.Small),
          new ItemElement(RoomSizeName.Medium),
        ])
        .addDependence("instruction-1", [new ItemElement(ServiceName.PC)])
        .addDependence("instruction-1", [
          new ItemElement(CameraName.MeetUp2),
          new ItemElement(CameraName.RallyBarHuddle),
          new ItemElement(CameraName.RallyBar),
          new ItemElement(CameraName.RallyBarMini),
        ])
        .addDependence("instruction-2", [
          new ItemElement(RoomSizeName.Large),
          new ItemElement(RoomSizeName.Auditorium),
        ])
        .addDependence("instruction-2", [
          new ItemElement(ServiceName.PC),
          new ItemElement(ServiceName.Android),
        ])
        .addDependence("instruction-2", [
          new ItemElement(CameraName.RallyBar),
          new ItemElement(CameraName.RallyPlus),
        ])
    )
    .addElement(
      new ItemElement(CameraName.RoomMate)
        .setRequired(true)
        .setAccessoryItems([CameraName.ComputeMount])
        .addDependence("instruction-1", [
          new ItemElement(RoomSizeName.Large),
          new ItemElement(RoomSizeName.Auditorium),
        ])
        .addDependence("instruction-1", [new ItemElement(ServiceName.Android)])
        .addDependence("instruction-1", [new ItemElement(CameraName.RallyPlus)])
    );

  const groupSight = new GroupElement().addElement(
    new ItemElement(CameraName.LogitechSight).setDefaultMount(
      new MountElement(
        CameraName.LogitechSight,
        PlacementManager.getNameNodeForSight()
      )
    )
  );

  stepConferenceCamera.allElements = [
    group,
    groupRallyCamera,
    groupCompute,
    groupSight,
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
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicSingle())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )

          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicSingle())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPod)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
      )
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodMount]: ["color", "count"],
        [AudioExtensionName.RallyMicPodPendantMount]: ["count"],
      })
      .addReservationMount({
        [CameraName.LogitechSight]: [3],
      })
      .addSecondaryMount({
        [CameraName.RallyPlus]: [1, 2],
      })
      .setAccessoryItems([
        AudioExtensionName.RallyMicPodMount,
        AudioExtensionName.RallyMicPodPendantMount,
      ])
      .addDisabledColorDependence({
        [CameraName.RallyPlus]: {
          active: true,
        },
      })
  );
  const group2 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodMount)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPodMount,
          PlacementManager.getNameNodeForMic()
        )
          .setDependentMount(
            new ReferenceMountElement(
              AudioExtensionName.RallyMicPod,
              PlacementManager.getNameNodeMicPodMount()
            )
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicSingle())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )

          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicSingle())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMic())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodeForMicDouble())
              .build()
          )
      )
      .addReservationMount({
        [CameraName.LogitechSight]: [3],
      })
      .setDisabledColor(true)
      .setHiddenColor(true)
      .addDisabledCounterDependence({
        [AudioExtensionName.RallyMicPodPendantMount]: {
          active: false,
        },
      })
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodPendantMount]: ["count"],
      })
  );
  const group3 = new GroupElement().addElement(
    new ItemElement(AudioExtensionName.RallyMicPodPendantMount)
      .setDefaultMount(
        new CountableMountElement(
          AudioExtensionName.RallyMicPodPendantMount,
          PlacementManager.getNameNodePendantMount()
        )
          .setDependentMount(
            new ReferenceMountElement(
              AudioExtensionName.RallyMicPod,
              PlacementManager.getNameNodePodPendantMount()
            )
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountSingle()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodePendantMount())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Large).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodePendantMount())
              .build()
          )

          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountSingle()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      false
                    )
                  )
              )
              .addChange("nodeName", PlacementManager.getNameNodePendantMount())
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 1)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 2)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(AudioExtensionName.RallyMicPodPendantMount)
                  .addProperty(ConditionPropertyName.COUNT, 3)
                  .addDependentCondition(
                    new Condition(RoomSizeName.Medium).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
                  .addDependentCondition(
                    new Condition(CameraName.LogitechSight).addProperty(
                      ConditionPropertyName.ACTIVE,
                      true
                    )
                  )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodePendantMountDouble()
              )
              .build()
          )
      )
      .setHiddenColor(true)
      .addDisabledCounterDependence({
        [AudioExtensionName.RallyMicPodMount]: {
          active: false,
        },
      })
      .addAutoChangeItems({
        [AudioExtensionName.RallyMicPodMount]: ["count"],
      })
      .addReservationMount({
        [CameraName.LogitechSight]: [3],
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
        )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(RoomSizeName.Large).addProperty(
                  ConditionPropertyName.ACTIVE,
                  true
                )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodeForTap("Table", 2)
              )
              .build()
          )
          .setDependentMount(
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
        )
          .addConditionNameNode(
            new ConditionChangeBuilder()
              .setCondition(
                new Condition(RoomSizeName.Large).addProperty(
                  ConditionPropertyName.ACTIVE,
                  true
                )
              )
              .addChange(
                "nodeName",
                PlacementManager.getNameNodeForTap("Table", 2)
              )
              .build()
          )
          .setDependentMount(
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
        ).addConditionNameNode(
          new ConditionChangeBuilder()
            .setCondition(
              new Condition(RoomSizeName.Large).addProperty(
                ConditionPropertyName.ACTIVE,
                true
              )
            )
            .addChange(
              "nodeName",
              PlacementManager.getNameNodeForTap("Table", 2)
            )
            .build()
        )
      )
      .setAccessoryItems([
        MeetingControllerName.TapTableMount,
        MeetingControllerName.TapRiserMount,
        MeetingControllerName.TapWallMount,
      ]);
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
    )
    .addElement(
      new ItemElement(MeetingControllerName.RallyBarHuddleTapIP).setVisible(
        false
      )
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
          .setHiddenColor(true)
      )
      .addAutoChangeItems({
        [VideoAccessoryName.LogitechTapSchedulerAngleMount]: ["color"],
        [VideoAccessoryName.LogitechTapSchedulerSideMount]: ["color"],
      })
      .setAccessoryItems([VideoAccessoryName.LogitechTapSchedulerAngleMount])
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
    .addElement(new ItemElement(VideoAccessoryName.LogitechUSBaToHDMIAdapter))
    .addElement(
      new ItemElement(VideoAccessoryName.MeetUp2ActiveCable).addDependence(
        "instruction-1",
        new ItemElement(CameraName.MeetUp2)
      )
    );

  stepVideoAccessories.allElements = [groupScheduler, group];
  return stepVideoAccessories;
}

export function createStepSoftwareServices() {
  const stepSoftwareServices = new Step(StepName.SoftwareServices);
  const group = new GroupElement()
    .addElement(new ItemElement(SoftwareServicesName.LogitechSync))
    .addElement(
      new ItemElement(SoftwareServicesName.SupportService).setRecommended(true)
    )
    .addElement(new ItemElement(SoftwareServicesName.ExtendedWarranty))
    .addElement(new ItemElement(SoftwareServicesName.EssentialServicePlan));
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
    ...Object.values(TVName),
  ];

  const isItemNameMatching =
    (threekitItemName_local: string) => (permissionName: string) =>
      threekitItemName_local.toLowerCase() === permissionName.toLowerCase();

  const isColorItemNameMatching =
    (threekitItemName_local: string) => (permissionName: string) => {
      const separatorItemColor = getSeparatorItem();

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

export const getTVMountNameBySettings = (
  roomSize: string,
  platform: string
) => {
  if (platform === PlatformName.BYOD) {
    return TVName.LogitechTVOne;
  }
  switch (roomSize) {
    case RoomSizeName.Phonebooth:
    case RoomSizeName.Huddle:
    case RoomSizeName.Small:
      return TVName.LogitechTVOne;
    case RoomSizeName.Medium:
    case RoomSizeName.Large:
    case RoomSizeName.Auditorium:
      return TVName.LogitechTVTwo;
    default:
      return TVName.LogitechTVOne;
  }
};

export const getTVMountByName = (name: TVName) => {
  switch (name) {
    case TVName.LogitechTVOne:
      return new MountElement(
        TVName.LogitechTVOne,
        PlacementManager.getNameNodeForTV()
      );
    case TVName.LogitechTVTwo:
      return new MountElement(
        TVName.LogitechTVTwo,
        PlacementManager.getNameNodeForTV()
      );
    default:
      return new MountElement(
        TVName.LogitechTVOne,
        PlacementManager.getNameNodeForTV()
      );
  }
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

export const isExtendWarranty = (name: string) => {
  return isCompareName(name)([SoftwareServicesName.ExtendedWarranty]);
};

export const isBundleElement = (name: string) => {
  return isCompareName(name)([
    MeetingControllerName.RallyBarTapIP,
    MeetingControllerName.RallyBarMiniTapIP,
    MeetingControllerName.RallyBarHuddleTapIP,
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

export const getSortedKeyPermissions = (
  stepName: StepName,
  activeKeyPermissions: string[]
) => {
  switch (stepName) {
    case StepName.Services:
      return [ServiceName.Android, ServiceName.PC];
    case StepName.ConferenceCamera:
      return [
        CameraName.RallyBar,
        CameraName.RallyBarMini,
        CameraName.RallyBarHuddle,
        CameraName.MeetUp2,
        CameraName.RallyPlus,
        CameraName.LogitechSight,
      ];
    case StepName.SoftwareServices:
      return [
        SoftwareServicesName.SupportService,
        SoftwareServicesName.EssentialServicePlan,
        SoftwareServicesName.LogitechSync,
        SoftwareServicesName.ExtendedWarranty,
      ];
    case StepName.MeetingController:
      if (activeKeyPermissions.includes(ServiceName.PC)) {
        return [
          MeetingControllerName.LogitechTap,
          MeetingControllerName.LogitechTapIP,
          MeetingControllerName.TapTableMount,
          MeetingControllerName.TapRiserMount,
          MeetingControllerName.TapWallMount,
        ];
      }
      return [
        MeetingControllerName.LogitechTapIP,
        MeetingControllerName.LogitechTap,
        MeetingControllerName.TapTableMount,
        MeetingControllerName.TapRiserMount,
        MeetingControllerName.TapWallMount,
      ];
    default:
      return [];
  }
};
