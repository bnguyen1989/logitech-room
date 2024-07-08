import {
  AudioExtensionName,
  CameraName,
  RoomSizeName,
} from "../../../utils/permissionUtils";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const activeElements = step.getChainActiveElements().flat();
    const isLargeRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Auditorium
    );
    if (!isLargeRoom) return true;

    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      if (element.name === AudioExtensionName.RallyMicPodPendantMount) {
        element.addReservationMount({
          [CameraName.LogitechSight]: [3],
        });
      }
    });
    return true;
  }
}
