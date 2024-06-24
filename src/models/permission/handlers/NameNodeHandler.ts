import {
  AudioExtensionName,
  CameraName,
  RoomSizeName,
} from "../../../utils/permissionUtils";
import { PlacementManager } from "../../configurator/PlacementManager";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";
import { Step } from "../step/Step";
import { Handler } from "./Handler";

export class NameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const activeElements = step.getChainActiveElements().flat();
    const isLargeRoom = activeElements.some(
      (element) => element.name === RoomSizeName.Large
    );
    if (!isLargeRoom) return true;

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

      if (element.name === CameraName.RallyPlus) {
        const bundleElements = element.getBundleMount();
        const micPodBundle = bundleElements.find(
          (bundleElement) =>
            bundleElement.name === AudioExtensionName.RallyMicPod
        );
        if (micPodBundle instanceof CountableMountElement) {
          element
            .removeBundleMount(micPodBundle)
            .addBundleMount(
              new CountableMountElement(
                AudioExtensionName.RallyMicPod,
                PlacementManager.getNameNodeForMicWithoutMount()
              )
                .setActiveIndex(micPodBundle.activeIndex)
                .setMin(micPodBundle.min)
                .setMax(micPodBundle.max)
            );
        }
      }
    });
    return true;
  }
}
