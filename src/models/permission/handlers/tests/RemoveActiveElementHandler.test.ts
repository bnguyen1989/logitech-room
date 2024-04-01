import { CameraName } from "../../../../utils/permissionUtils";
import { Permission } from "../../Permission";
import { StepName } from "../../type";
import { RemoveActiveElementHandler } from "../RemoveActiveElementHandler";

describe("RemoveActiveElementHandler", () => {
  test("Must delete the active mount element if the item element to which it belongs is deleted", () => {
    const permission = new Permission(
      [CameraName.WallMountForVideoBars],
      {
        [CameraName.RallyBar]: {
          color: "Graphite",
        },
        [CameraName.WallMountForVideoBars]: {},
      },
      StepName.ConferenceCamera
    );
    const currentStep = permission.getCurrentStep();
    if (!currentStep) return;
    const elementRallyBar = currentStep.getElementByName(CameraName.RallyBar);
    if (!elementRallyBar) return;
    new RemoveActiveElementHandler(elementRallyBar).handle(currentStep);
    expect(currentStep.getActiveElements().length).toBe(0);
  });
});
