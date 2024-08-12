import { ItemElement } from "../../elements/ItemElement";
import { AttributeMountElement } from "../../elements/mounts/AttributeMountElement";
import { Step } from "../../step/Step";
import { Handler } from "../Handler";

export class ConditionAttributesMountHandler extends Handler {
  public handle(step: Step): boolean {
    const visibleElements = step.getValidElements();
    visibleElements.forEach((element) => {
      if (!(element instanceof ItemElement)) return;
      const conditionAttributes = element.getConditionAttributesMount();
      if (!Object.keys(conditionAttributes).length) return;

      const allActiveElements = step.getChainActiveElements().flat();
      Object.entries(conditionAttributes).forEach(([key, value]) => {
        [element.getDefaultMount(), ...element.getDependenceMount()].forEach(
          (mount) => {
            if (!mount || !(mount instanceof AttributeMountElement)) return;
            Object.entries(value).forEach(([attrName, conditionParam]) => {
              if (mount.name !== attrName) return;
              const isActiveItem = allActiveElements.some((activeElement) =>
                conditionParam.nameNodes.includes(activeElement.name)
              );
              if (!isActiveItem) return;
              mount.updateAttributes({ [key]: conditionParam.value });
            });
          }
        );
      });
    });

    return true;
  }
}
