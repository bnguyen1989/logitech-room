import { StepName } from "../../../../../../utils/baseUtils";
import {
  AudioExtensionName,
  CameraName,
} from "../../../../../../utils/permissionUtils";
import { ItemElement } from "../../../../elements/ItemElement";
import { CountableMountElement } from "../../../../elements/mounts/CountableMountElement";
import { Step } from "../../../../step/Step";
import { SecondaryMountHandler } from "../SecondaryMountHandler";

describe("SecondaryMountHandler", () => {
  describe("secondary countable elements", () => {
    test("should generate correct range name nodes for countable mount with secondary mounts", () => {
      const step = new Step(StepName.AudioExtensions);
      const micPodElement = new ItemElement(AudioExtensionName.RallyMicPod);
      const countableMountElement = new CountableMountElement(
        AudioExtensionName.RallyMicPod,
        "test_node"
      );
      countableMountElement.setMin(2);
      countableMountElement.setMax(4);
      micPodElement.setDefaultMount(countableMountElement);
      micPodElement.addSecondaryMount({
        [CameraName.RallyPlus]: [1, 2],
      });
      step.addValidElement(micPodElement);

      const rallyPlusElement = new ItemElement(CameraName.RallyPlus);
      step.addValidElement(rallyPlusElement);
      step.addActiveElement(rallyPlusElement);

      new SecondaryMountHandler().handle(step);
      const nameNodes = countableMountElement.getRangeNameNode();
      expect(nameNodes.length).toBe(4);
      expect(nameNodes).toEqual([
        "test_node_3",
        "test_node_4",
        "test_node_1",
        "test_node_2",
      ]);
    });
    test("should generate available name nodes with correct active index for countable mount", () => {
      const step = new Step(StepName.AudioExtensions);
      const micPodElement = new ItemElement(AudioExtensionName.RallyMicPod);
      const countableMountElement = new CountableMountElement(
        AudioExtensionName.RallyMicPod,
        "test_node"
      );
      countableMountElement.setMin(4);
      countableMountElement.setMax(6);
      countableMountElement.setActiveIndex(5);
      micPodElement.setDefaultMount(countableMountElement);
      micPodElement.addSecondaryMount({
        [CameraName.RallyPlus]: [1, 2, 3, 4],
      });
      step.addValidElement(micPodElement);

      const rallyPlusElement = new ItemElement(CameraName.RallyPlus);
      step.addValidElement(rallyPlusElement);
      step.addActiveElement(rallyPlusElement);

      new SecondaryMountHandler().handle(step);
      const nameNodes = countableMountElement.getAvailableNameNode();
      expect(nameNodes.length).toBe(5);
      expect(nameNodes).toEqual([
        "test_node_5",
        "test_node_1",
        "test_node_2",
        "test_node_3",
        "test_node_4",
      ]);
    });
  });
});
