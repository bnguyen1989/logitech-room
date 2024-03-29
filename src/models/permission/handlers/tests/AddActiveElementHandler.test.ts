import { CameraName, PlatformName } from "../../../../utils/permissionUtils";
import { Permission } from "../../Permission";
import { ItemElement } from "../../elements/ItemElement";
import { StepName } from "../../type";
import { AddActiveElementHandler } from "../AddActiveElementHandler";

describe("AddActiveElementHandler", () => {
  describe("element from group isRequiredOne", () => {
    test("test", () => {
      const permission = new Permission(
        [PlatformName.GoogleMeet, PlatformName.MicrosoftTeams],
        { [PlatformName.GoogleMeet]: {}, [PlatformName.MicrosoftTeams]: {} },
        StepName.Platform
      );
      const step = permission.getCurrentStep();
      if (!step) return;
      const elementAdded = step.getElementByName(PlatformName.MicrosoftTeams);
      if (!elementAdded) return;

      new AddActiveElementHandler(elementAdded).handle(step);

      expect(step.getActiveElements().length).toBe(1);
      expect(step.getActiveElements()[0].name).toBe(
        PlatformName.MicrosoftTeams
      );
    });
  });
  describe("element with dependent mounts", () => {
    test("test2", () => {
      const permission = new Permission(
        [CameraName.RallyBar],
        {
          [CameraName.RallyBar]: {},
        },
        StepName.ConferenceCamera
      );
      const step = permission.getCurrentStep();
      if (!step) return;
      const elementAdded = step.getElementByName(CameraName.RallyBar);
      if (!(elementAdded instanceof ItemElement)) return;

      new AddActiveElementHandler(elementAdded).handle(step);

      const dependenceMount = elementAdded.getDependenceMount();
      const validElements = step.getValidElements();
      dependenceMount.forEach((mount) => {
        const isExistMount = validElements.some(
          (elem) => elem.name === mount.name
        );
        expect(isExistMount).toBe(true);
      });
    });
  });
});
