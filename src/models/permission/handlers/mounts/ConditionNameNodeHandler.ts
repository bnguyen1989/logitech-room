import { Condition } from "../../conditions/Condition";
import { ConditionPropertyName } from "../../conditions/type";
import { ItemElement } from "../../elements/ItemElement";
import { MountElement } from "../../elements/mounts/MountElement";
import { Step } from "../../step/Step";
import { Handler } from "../Handler";

export class ConditionNameNodeHandler extends Handler {
  public handle(step: Step): boolean {
    const visibleElements = step.getValidElements();
    const allActiveElements = step.getChainActiveElements().flat();
    visibleElements.forEach((element) => {
      const mounts = this.getMountElementsByElement(element);
      mounts.forEach((mount) => {
        const conditionNameNodes = mount.getConditionNameNodes();
        const nameNodes = Object.keys(conditionNameNodes);
        if (!nameNodes.length) return;

        const nameNode = nameNodes.find((name) => {
          const condition = conditionNameNodes[name];
          const isValidDependentConditions = condition
            .getDependentConditions()
            .every((dependentCondition) =>
              this.checkCondition(dependentCondition, mount, allActiveElements)
            );
          if (!isValidDependentConditions) return false;

          return this.checkCondition(condition, mount, allActiveElements);
        });
        if (nameNode) {
          mount.nodeName = nameNode;
        }
      });
    });
    return true;
  }

  private checkCondition(
    condition: Condition,
    mountElement: MountElement,
    allActiveElements: (ItemElement | MountElement)[]
  ): boolean {
    const property = {
      ...mountElement.getProperty(),
      [ConditionPropertyName.ACTIVE]: allActiveElements.some(
        (activeElement) => activeElement.name === condition.getKeyPermission()
      ),
    };
    return condition.checkCondition(property);
  }

  private getMountElementsByElement(
    element: MountElement | ItemElement
  ): MountElement[] {
    if (element instanceof MountElement) {
      return [element];
    }
    const mounts = [
      ...element.getDependenceMount(),
      ...element.getBundleMount(),
    ];
    const defaultMount = element.getDefaultMount();
    if (defaultMount) {
      mounts.push(defaultMount);
    }
    return mounts;
  }
}
