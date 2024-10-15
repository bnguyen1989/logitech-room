import {
  AudioExtensionName,
  CameraName,
  isCameraElement,
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
        isAltRoom &&
        element.name === AudioExtensionName.RallyMicPodPendantMount
      ) {
        if (!activeRallyBarWithSight && !activeOnlyRallyBar) return;
        const nameNode = activeOnlyRallyBar
          ? PlacementManager.getNameNodePendantMountWithoutSight()
          : PlacementManager.getNameNodePendantMountWithSight();
        const defaultMount = element.getDefaultMount();
        if (defaultMount instanceof CountableMountElement) {
          defaultMount.nodeName = nameNode;
        }
      }

      if (isBYOD && isCameraElement(element.name)) {
        element.setHiddenDisplay(true);
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
    });
    return true;
  }
}
