import { AudioExtensionName } from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { Step } from "../../../step/Step";
import { StepName } from "../../../type";
import { RequiredElementHandler } from "../RequiredElementHandler";

describe("RequiredElementHandler", () => {
  test("Checking required elements: Example - 'Rally Mic Pod Hub'", () => {
    const step = new Step(StepName.AudioExtensions);
    const micPod = new ItemElement(AudioExtensionName.RallyMicPod);
    const elements = [
      micPod,
      new ItemElement(AudioExtensionName.RallyMicPodHub).addRequiredDependence({
        [AudioExtensionName.RallyMicPod]: {
          active: true,
        },
      }),
    ];
    step.allElements = [...elements];
    elements.forEach((element) => step.addValidElement(element));
    step.addActiveElement(micPod);

    new RequiredElementHandler().handle(step);

    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRequired()).toBe(true);
  });

  test("Checking non-required elements: Example - 'Rally Mic Pod Hub'", () => {
    const step = new Step(StepName.AudioExtensions);
    const micPod = new ItemElement(AudioExtensionName.RallyMicPod);
    const elements = [
      micPod,
      new ItemElement(AudioExtensionName.RallyMicPodHub).addRequiredDependence({
        [AudioExtensionName.RallyMicPod]: {
          active: true,
        },
      }),
    ];
    step.allElements = [...elements];
    elements.forEach((element) => step.addValidElement(element));

    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRequired()).toBe(false);
  });
});
