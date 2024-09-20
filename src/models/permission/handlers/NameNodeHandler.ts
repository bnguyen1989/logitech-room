import {
  AudioExtensionName,
  CameraName,
  MeetingControllerName,
  PlatformName,
  RoomSizeName,
} from "../../../utils/permissionUtils";
import { PlacementManager } from "../../configurator/PlacementManager";
import { RuleBuilder } from "../../configurator/RuleBuilder";
import { RuleManagerMount } from "../../configurator/RuleManagerMount";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const activeElements = step.getChainActiveElements().flat();

    const isAltRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Auditorium
    );

    const isLargeRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Large
    );

    const isBYOD = activeElements.some(
      (element) => element.name === PlatformName.BYOD
    );

    const isRallyBar = activeElements.some((element) =>
      element.name.includes(CameraName.RallyBar)
    );

    const isSight = activeElements.some(
      (element) => element.name === CameraName.LogitechSight
    );

    const activeOnlyRallyBar = isRallyBar && !isSight;
    const activeRallyBarWithSight = isRallyBar && isSight;

    const arrElementsMic: string[] = [
      AudioExtensionName.RallyMicPod,
      AudioExtensionName.RallyMicPodMount,
    ];

    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      if (isAltRoom && arrElementsMic.includes(element.name)) {
        if (!activeRallyBarWithSight && !activeOnlyRallyBar) return;
        const nameNode = activeOnlyRallyBar
          ? PlacementManager.getNameNodeForMicWithoutSight()
          : PlacementManager.getNameNodeForMicWithSight();
        const defaultMount = element.getDefaultMount();
        if (defaultMount instanceof CountableMountElement) {
          defaultMount.nodeName = nameNode;
        }
      }

      if (
        isBYOD &&
        (element.name === CameraName.RallyBar ||
          element.name === CameraName.RallyBarMini)
      ) {
        element.getDependenceMount().forEach((dependenceMount) => {
          if (dependenceMount.name === CameraName.TVMountForVideoBars) {
            dependenceMount.nodeName = PlacementManager.getNameNodeForCamera(
              "TV",
              1,
              1
            );
          }
        });
      }

      if (isLargeRoom && isSight) {
        if (element.name === AudioExtensionName.RallyMicPod) {
          const defaultMount = element.getDefaultMount();
          if (defaultMount instanceof CountableMountElement) {
            defaultMount.setMountLogic([
              RuleManagerMount.createRuleObject({
                keyPermission: CameraName.LogitechSight,
                condition: RuleBuilder.newRule()
                  .ruleFor("count")
                  .equalTo(1)
                  .build(),
                action: RuleManagerMount.generateActionAddNodesAndRemoveNodes({
                  setNodes: [PlacementManager.getNameNodeForSight()],
                  remoteNodes: [PlacementManager.getNameNodeForSight2()],
                }),
              }),
              RuleManagerMount.createRuleObject({
                keyPermission: CameraName.LogitechSight,
                condition: RuleBuilder.newRule()
                  .ruleFor("count")
                  .equalTo(2)
                  .build(),
                action: RuleManagerMount.generateActionAddNodesAndRemoveNodes({
                  setNodes: [PlacementManager.getNameNodeForSight2()],
                  remoteNodes: [PlacementManager.getNameNodeForSight()],
                }),
              }),
            ]);
          }
        }
      }

      if (isLargeRoom) {
        if (
          element.name === MeetingControllerName.LogitechTap ||
          element.name === MeetingControllerName.LogitechTapIP
        ) {
          [element.getDefaultMount(), ...element.getDependenceMount()].forEach(
            (mount) => {
              if (
                mount &&
                !(mount instanceof CountableMountElement) &&
                mount.nodeName ===
                  PlacementManager.getNameNodeForTap("Table", 1)
              ) {
                mount.nodeName = PlacementManager.getNameNodeForTap("Table", 2);
              }
            }
          );
        }
      }
    });
    return true;
  }
}
