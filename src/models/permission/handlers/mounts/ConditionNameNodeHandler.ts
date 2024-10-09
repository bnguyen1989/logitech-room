import { ConditionExecutor } from "../../conditions/ConditionExecutor";
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
        if (!conditionNameNodes.length) return;

        const conditionExecuter = new ConditionExecutor();
        conditionNameNodes.forEach((conditionNameNode) => {
          conditionExecuter.addConditionWithChanges(conditionNameNode);
        });
        const changedProperty = conditionExecuter.applyChangesIfConditionsMet(
          mount.getProperty(),
          allActiveElements.map((activeElement) => activeElement.name)
        );

        Object.keys(changedProperty).forEach((key: string) => {
          if (Object.prototype.hasOwnProperty.call(mount, key)) {
            mount[key as keyof MountElement] = changedProperty[key];
          }
        });
      });
    });
    return true;
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
