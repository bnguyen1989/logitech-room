import { ItemElement } from "../../elements/ItemElement";
import { AttributeMountElement } from "../../elements/mounts/AttributeMountElement";
import { MountElement } from "../../elements/mounts/MountElement";
import { Step } from "../../step/Step";
import { PropertyDependentElement } from "../../type";
import { Handler } from "../Handler";

export class ConditionAttributesMountHandler extends Handler {
  public handle(step: Step): boolean {
    const visibleElements = step.getChainElements().flat();
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
              const isMet = this.conditionMet(
                visibleElements,
                allActiveElements,
                conditionParam.condition
              );
              if (!isMet) return;
              mount.updateAttributes({ [key]: conditionParam.value });
            });
          }
        );
      });
    });

    return true;
  }

  private conditionMet(
    visibleElements: (ItemElement | MountElement)[],
    activeElements: (ItemElement | MountElement)[],
    condition: PropertyDependentElement
  ) {
    return Object.entries(condition).some(([key, value]) => {
      const isActive = value["active"];
      const activeElement = activeElements.find(
        (activeElement) => key === activeElement.name
      );

      console.log('activeElement',activeElement);

      if (isActive && !activeElement) {
        return false;
      }
      if (!isActive && activeElement) {
        return false;
      }

      const visibleElement = visibleElements.find(
        (visibleElement) => key === visibleElement.name
      );
      if (!visibleElement) {
        return false;
      }
      const properties = visibleElement.getProperty();
      

      return Object.entries(value.property ?? {}).every(
        ([property, propertyValue]) => {
          return properties[property] === propertyValue;
        }
      );
    });
  }
}
