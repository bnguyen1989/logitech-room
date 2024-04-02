import {
  AudioExtensionName,
  CameraName,
} from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { CountableMountElement } from "../../../elements/mounts/CountableMountElement";
import { Step } from "../../../step/Step";
import { StepName } from "../../../type";
import { ReservationMountHandler } from "../ReservationMountHandler";

describe("ReservationMountHandler", () => {
  describe("reservation countable elements", () => {
    test("should allocate reservation mounts for countable elements", () => {
      const step = new Step(StepName.AudioExtensions);
      const sightElement = new ItemElement(CameraName.LogitechSight);
      const micPodElement = new ItemElement(AudioExtensionName.RallyMicPod);
      const countableMountElement = new CountableMountElement(
        AudioExtensionName.RallyMicPod,
        "test_node"
      );
      countableMountElement.setMin(0);
      countableMountElement.setMax(3);
      micPodElement.setDefaultMount(countableMountElement);
      micPodElement.addReservationMount({
        [CameraName.LogitechSight]: [3],
      }),
        step.addValidElement(micPodElement);
      step.addActiveElement(sightElement);

      new ReservationMountHandler().handle(step);
      const nameNodes = countableMountElement.getRangeNameNode();
      expect(nameNodes.length).toBe(3);
      expect(nameNodes).toEqual(["test_node_1", "test_node_2", "test_node_4"]);
    });
  });
});
