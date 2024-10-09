import { StepName } from "../../../../../utils/baseUtils";
import { CameraName, PlatformName } from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { AttributeMountElement } from "../../../elements/mounts/AttributeMountElement";
import { Step } from "../../../step/Step";
import { ConditionAttributesMountHandler } from "../ConditionAttributesMountHandler";

describe("ConditionAttributesMountHandler", () => {
  test("should correctly apply default mount and attributes when valid elements are added with conditions", () => {
    const step = new Step(StepName.ConferenceCamera);
    const byod = new ItemElement(PlatformName.BYOD);
    const rallyPLus = new ItemElement(CameraName.RallyPlus)
      .setAccessoryItems([CameraName.RallyMountingKit])
      .setDefaultMount(
        new AttributeMountElement(
          CameraName.RallyMountingKit,
          "rally_plus_node"
        ).setAttributes({
          Position: true,
          Alternative_rally_plus: false,
          display: false,
        })
      )
      .addConditionAttributesMount({
        display: {
          [CameraName.RallyMountingKit]: {
            nameNodes: [PlatformName.BYOD],
            value: true,
          },
        },
      });

    step.addValidElement(byod);
    step.addActiveElement(byod);
    step.addValidElement(rallyPLus);

    new ConditionAttributesMountHandler().handle(step);
    const validElements = step.getValidElements();
    expect(validElements.length).toBe(2);
    const defaultMount = rallyPLus.getDefaultMount();
    expect(defaultMount).toBeInstanceOf(AttributeMountElement);
    if (!(defaultMount instanceof AttributeMountElement)) return;
    expect(defaultMount.getAttributes()).toEqual({
      Position: true,
      Alternative_rally_plus: false,
      display: true,
    });
  });
});
