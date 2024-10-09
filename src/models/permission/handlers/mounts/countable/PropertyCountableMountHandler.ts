import { ItemElement } from "../../../elements/ItemElement";
import { CountableMountElement } from "../../../elements/mounts/CountableMountElement";
import { Step } from "../../../step/Step";
import { Handler } from "../../Handler";

export abstract class PropertyCountableMountHandler extends Handler {
  protected handleMount(
    step: Step,
    getMountCallback: (element: ItemElement) => Record<string, any[]>,
    processMountCallback: (
      mount: CountableMountElement,
      value: number[]
    ) => void
  ): void {
    const visibleElements = step.getValidElements();
    visibleElements.forEach((element) => {
      if (!(element instanceof ItemElement)) return;

      const mount = getMountCallback(element);
      if (!Object.keys(mount).length) return;

      const allActiveElements = step.getChainActiveElements().flat();
      Object.entries(mount).forEach(([key, value]) => {
        const isActiveItem = allActiveElements.some(
          (activeElement) => activeElement.name === key
        );
        if (!isActiveItem) return;

        const defaultMount = element.getDefaultMount();
        const isNumberArray = value.every((index) => typeof index === "number");

        if (defaultMount instanceof CountableMountElement && isNumberArray) {
          processMountCallback(defaultMount, value as number[]);
        }
      });
    });
  }
}
