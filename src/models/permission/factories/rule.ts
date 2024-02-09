import { AudioExtensionRule } from "../rules/AudioExtensionRule";
import { CameraRule } from "../rules/CameraRule";
import { MeetingControllerRule } from "../rules/MeetingContollerRule";
import { PlatformRule } from "../rules/PlatformRule";
import { RoomRule } from "../rules/RoomRule";
import { ServiceRule } from "../rules/ServiceRule";
import { SoftwareServiceRule } from "../rules/SoftwareServiceRule";
import { VideoAccessoriesRule } from "../rules/VideoAccessoriesRule";
import { StepName } from "../type";

export function ruleFactoryMethod(name: StepName) {
  switch (name) {
    case StepName.Platform:
      return new PlatformRule();
    case StepName.RoomSize:
      return new RoomRule();
    case StepName.Services:
      return new ServiceRule();
    case StepName.ConferenceCamera:
      return new CameraRule();
    case StepName.AudioExtensions:
      return new AudioExtensionRule();
    case StepName.MeetingController:
      return new MeetingControllerRule();
    case StepName.VideoAccessories:
      return new VideoAccessoriesRule();
    case StepName.SoftwareServices:
      return new SoftwareServiceRule();
    default:
      throw new Error("Invalid StepName");
  }
}
