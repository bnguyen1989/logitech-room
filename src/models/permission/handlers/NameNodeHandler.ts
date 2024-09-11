import {
  AudioExtensionName,
  CameraName,
  PlatformName,
  RoomSizeName,
} from "../../../utils/permissionUtils";
import { PlacementManager } from "../../configurator/PlacementManager";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const activeElements = step.getChainActiveElements().flat();

    const isAltRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Auditorium
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
    });
    return true;
  }
}
