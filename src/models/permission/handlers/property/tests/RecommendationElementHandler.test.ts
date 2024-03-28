import { AudioExtensionName } from "../../../../../utils/permissionUtils";
import { Permission } from "../../../Permission";
import { StepName } from "../../../type";

describe("RecommendationElementHandler", () => {
  const permission = new Permission(
    [AudioExtensionName.RallyMicPod],
    {
      [AudioExtensionName.RallyMicPod]: {
        color: "White",
        count: 2,
        counterMin: 0,
        counterMax: 3,
      },
      [AudioExtensionName.RallyMicPodMount]: {
        color: "White",
        count: 2,
        counterMin: 0,
        counterMax: 2,
      },
    },
    StepName.AudioExtensions
  );

  test(" Checking recommended elements: Rally Mic Pod Hub", () => {
    const step = permission.getCurrentStep();
    if (!step) return;
    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRecommended()).toBe(true);
  });
  test("Checking recommended elements: Rally Mic Pod Pendant Mount", () => {
    const step = permission.getCurrentStep();
    if (!step) return;
    const element = step.getElementByName(
      AudioExtensionName.RallyMicPodPendantMount
    );
    if (!element) return;
    expect(element.getRecommended()).toBe(true);
  });
});
