import { RootState } from "../../..";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { StepName } from "../../../../utils/baseUtils";
import { getPermission } from "./selectors";

export const getAutoChangeDataByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!step) return {};
    const element = step.getElementByName(keyPermission);
    if (!(element instanceof ItemElement)) return {};
    return element.getAutoChangeItems();
  };

export const getRecommendedDisplayByKeyPermission =
  (stepName: StepName, keyPermission: string) => (state: RootState) => {
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!step) return {};
    const element = step.getElementByName(keyPermission);
    if (!element) return {};
    return element.getRecommendedDisplay();
  };
