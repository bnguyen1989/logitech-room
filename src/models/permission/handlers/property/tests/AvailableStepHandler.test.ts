import { StepName } from "../../../../../utils/baseUtils";
import { RoomSizeName } from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { Step } from "../../../step/Step";
import { AvailableStepHandler } from "../AvailableStepHandler";

describe("AvailableStepHandler", () => {
  test("AudioExtension step availability should reflect phone booth inactivity", () => {
    const stepRoomSize = new Step(StepName.RoomSize);
    const phoneBooth = new ItemElement(RoomSizeName.Phonebooth);
    stepRoomSize.addActiveElement(phoneBooth);
    stepRoomSize.addValidElement(phoneBooth);
    stepRoomSize.allElements = [phoneBooth];
    const stepAudioExtension = new Step(StepName.AudioExtensions);
    stepAudioExtension.addAvailableDependence({
      [RoomSizeName.Phonebooth]: {
        active: false,
      },
    });
    stepRoomSize.nextStep = stepAudioExtension;
    stepAudioExtension.prevStep = stepRoomSize;
    new AvailableStepHandler().handle(stepAudioExtension);
    const available = stepAudioExtension.getAvailable();
    expect(available).toBe(false);
  });
});
