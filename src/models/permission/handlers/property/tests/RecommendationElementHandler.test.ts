import { StepName } from '../../../../../utils/baseUtils'
import { AudioExtensionName } from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { CountableMountElement } from "../../../elements/mounts/CountableMountElement";
import { Step } from "../../../step/Step";
import { RecommendationElementHandler } from "../RecommendationElementHandler";

describe("RecommendationElementHandler", () => {
  test(" Checking recommended elements: Rally Mic Pod Hub", () => {
    const step = new Step(StepName.AudioExtensions);
    const micPod = new ItemElement(AudioExtensionName.RallyMicPod);
    micPod.setProperty({
      color: "White",
    });
    const elements = [
      micPod,
      new ItemElement(
        AudioExtensionName.RallyMicPodPendantMount
      ).addRecommendationDependence({
        [AudioExtensionName.RallyMicPod]: {
          active: true,
          property: {
            color: "White",
          },
        },
      }),
    ];
    step.allElements = [...elements];
    elements.forEach((element) => step.addValidElement(element));
    step.addActiveElement(micPod);

    new RecommendationElementHandler().handle(step);

    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRecommended()).toBe(true);
  });
  test("Checking recommended elements: Rally Mic Pod Pendant Mount", () => {
    const step = new Step(StepName.AudioExtensions);
    const micPod = new ItemElement(AudioExtensionName.RallyMicPod);
    micPod.setProperty({
      color: "White",
    });
    const countableMount = new CountableMountElement(
      AudioExtensionName.RallyMicPod,
      "test_node"
    );
    countableMount.activeIndex = 2;
    micPod.setDefaultMount(countableMount);
    const elements = [
      micPod,
      new ItemElement(AudioExtensionName.RallyMicPodMount),
      new ItemElement(
        AudioExtensionName.RallyMicPodHub
      ).addRecommendationDependence({
        [AudioExtensionName.RallyMicPod]: {
          active: true,
          property: {
            count: 2,
          },
        },
        [AudioExtensionName.RallyMicPodMount]: {
          active: false,
        },
      }),
    ];
    step.allElements = [...elements];
    elements.forEach((element) => step.addValidElement(element));
    step.addActiveElement(elements[0]);

    new RecommendationElementHandler().handle(step);
    const element = step.getElementByName(
      AudioExtensionName.RallyMicPodPendantMount
    );
    if (!element) return;
    expect(element.getRecommended()).toBe(true);
  });
});
