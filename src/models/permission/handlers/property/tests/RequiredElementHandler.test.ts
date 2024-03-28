import {
  AudioExtensionName,
  CameraName,
} from "../../../../../utils/permissionUtils";
import { Permission } from "../../../Permission";
import { StepName } from "../../../type";

describe("RequiredElementHandler", () => {
  test("Checking required elements: Rally Mic Pod Hub", () => {
    const permission = new Permission(
      [AudioExtensionName.RallyMicPod, CameraName.RallyBarMini],
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
        [CameraName.RallyBarMini]: {
          color: "White",
        },
      },
      StepName.AudioExtensions
    );
    const step = permission.getCurrentStep();
    if (!step) return;
    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRequired()).toBe(true);
  });
  test("Checking non-required elements: Rally Mic Pod Hub", () => {
    const permission = new Permission(
      [AudioExtensionName.RallyMicPod, CameraName.RallyBarMini],
      {
        [AudioExtensionName.RallyMicPod]: {
          color: "White",
          count: 1,
          counterMin: 0,
          counterMax: 3,
        },
        [AudioExtensionName.RallyMicPodMount]: {
          color: "White",
          count: 2,
          counterMin: 0,
          counterMax: 2,
        },
        [CameraName.RallyBarMini]: {
          color: "White",
        },
      },
      StepName.AudioExtensions
    );
    const step = permission.getCurrentStep();
    if (!step) return;
    const element = step.getElementByName(AudioExtensionName.RallyMicPodHub);
    if (!element) return;
    expect(element.getRequired()).toBe(false);
  });
});
