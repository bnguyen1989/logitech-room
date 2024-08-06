import {
  AudioExtensionName,
  CameraName,
  PlatformName,
  RoomSizeName,
} from "../../../utils/permissionUtils";
import { PlacementManager } from "../../configurator/PlacementManager";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const activeElements = step.getChainActiveElements().flat();
    const isLargeRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Auditorium
    );

    const isBYOD = activeElements.some(
      (element) => element.name === PlatformName.BYOD
    );

    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      if (
        isLargeRoom &&
        element.name === AudioExtensionName.RallyMicPodPendantMount
      ) {
        element.addReservationMount({
          [CameraName.LogitechSight]: [3],
        });
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
