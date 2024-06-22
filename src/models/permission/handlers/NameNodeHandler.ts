import { AudioExtensionName } from "../../../utils/permissionUtils";
import { PlacementManager } from "../../configurator/PlacementManager";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const elements = step.getSimpleElements();
    elements.forEach((element) => {
      if (element.name === AudioExtensionName.RallyMicPod) {
        const defaultMount = element.getDefaultMount();
        if (defaultMount instanceof CountableMountElement) {
          defaultMount.nodeName =
            PlacementManager.getNameNodeForMicWithoutMount();
        }
      }

      if (element.name === AudioExtensionName.RallyMicPodMount) {
        const defaultMount = element.getDefaultMount();
        if (defaultMount instanceof CountableMountElement) {
          defaultMount.nodeName = PlacementManager.getNameNodeForMicWithMount();
        }
      }
    });
    return true;
  }
}
