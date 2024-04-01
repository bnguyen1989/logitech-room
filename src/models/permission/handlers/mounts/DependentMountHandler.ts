import { ItemElement } from "../../elements/ItemElement";
import { Step } from "../../step/Step";
import { Handler } from "../Handler";

export class DependentMountHandler extends Handler {
  public handle(step: Step): boolean {
    const stepActiveElements = step.getActiveElements();
    stepActiveElements.forEach((element) => {
      if (!(element instanceof ItemElement)) return;
      const mountElements = element.getDependenceMount();
      mountElements.forEach((mount) => {
        step.addValidElement(mount);
      });

      const isSomeMountActive = mountElements.some((mount) => {
        return stepActiveElements.some((activeElement) => {
          return activeElement.name === mount.name;
        });
      });
      const defaultMount = element.getDefaultMount();
      if (!defaultMount) return;
      const isExistDefaultMount = mountElements.some((mount) => {
        return defaultMount.name === mount.name;
      });
      if (mountElements.length && !isSomeMountActive && isExistDefaultMount) {
        step.addActiveElement(defaultMount);
      }
    });

    return true;
  }
}
