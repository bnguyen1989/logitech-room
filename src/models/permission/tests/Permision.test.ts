import { describe } from "node:test";
import { StepName } from "../type";
import { Permission } from "../Permission";
import {
  AudioExtensionName,
  CameraName,
  PlatformName,
  RoomSizeName,
  ServiceName,
  VideoAccessoryName,
} from "../../../utils/permissionUtils";
import { ItemElement } from "../elements/ItemElement";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";

describe("Permission", () => {
  const compareProperty = (
    property: Record<string, any>,
    propertyExpect: Record<string, any>
  ) => {
    Object.keys(propertyExpect).forEach((key) => {
      expect(property[key]).toBe(propertyExpect[key]);
    });
  };
  describe("should init Permission", () => {
    describe("init color for elements", () => {
      test("Color Initialization Test for step Conference Cameras", () => {
        const selectedKeys = [
          RoomSizeName.Medium,
          PlatformName.MicrosoftTeams,
          ServiceName.Android,
          CameraName.RallyBar,
        ];
        const dataItems = {
          [CameraName.RallyBar]: {
            color: "White",
          },
          [CameraName.LogitechSight]: {
            color: "Graphite",
          },
        };
        const permission = new Permission(
          selectedKeys,
          dataItems,
          StepName.ConferenceCamera
        );
        const currentStep = permission.getCurrentStep();
        if (!currentStep) return;
        const logitechSight = currentStep.getElementByName(
          CameraName.LogitechSight
        );
        if (logitechSight) {
          const property = logitechSight.getProperty();
          compareProperty(property, {
            color: "Graphite",
          });
        }
        const logitechRallyBar = currentStep.getElementByName(
          CameraName.RallyBar
        );

        if (logitechRallyBar) {
          const property = logitechRallyBar.getProperty();
          compareProperty(property, {
            color: "White",
          });
        }
      });

      test("Color Initialization Test for step Video Accessories", () => {
        const selectedKeys = [VideoAccessoryName.LogitechTapScheduler];
        const dataItems = {
          [VideoAccessoryName.LogitechTapScheduler]: {
            color: "White",
          },
          [VideoAccessoryName.LogitechTapSchedulerAngleMount]: {
            color: "White",
          },
        };
        const permission = new Permission(
          selectedKeys,
          dataItems,
          StepName.VideoAccessories
        );
        const currentStep = permission.getCurrentStep();
        if (!currentStep) return;
        const logitechTapScheduler = currentStep.getElementByName(
          VideoAccessoryName.LogitechTapScheduler
        );
        if (logitechTapScheduler) {
          const property = logitechTapScheduler.getProperty();
          compareProperty(property, {
            color: "White",
          });
        }
        const logitechTapSchedulerAngleMount = currentStep.getElementByName(
          VideoAccessoryName.LogitechTapSchedulerAngleMount
        );
        if (logitechTapSchedulerAngleMount) {
          const property = logitechTapSchedulerAngleMount.getProperty();
          compareProperty(property, {
            color: "White",
          });
        }
      });
    });

    describe("init count for elements", () => {
      test("Count Initialization Test for step Audio Extensions", () => {
        const selectedKeys = [AudioExtensionName.RallyMicPod];
        const dataItems = {
          [AudioExtensionName.RallyMicPod]: {
            count: 2,
            counterMin: 0,
            counterMax: 4,
          },
        };
        const permission = new Permission(
          selectedKeys,
          dataItems,
          StepName.AudioExtensions
        );
        const currentStep = permission.getCurrentStep();
        if (!currentStep) return;
        const micPod = currentStep.getElementByName(
          AudioExtensionName.RallyMicPod
        );
        if (!(micPod instanceof ItemElement)) return;
        const defaultMount = micPod.getDefaultMount();
        if (defaultMount instanceof CountableMountElement) {
          expect(defaultMount.activeIndex).toBe(2);
          expect(defaultMount.min).toBe(0);
          expect(defaultMount.max).toBe(4);
        }
      });
    });
  });

  describe("getDataForAdd", () => {
    test("Adding Active Element by Name with Single Camera", () => {
      const permission = new Permission(
        [CameraName.RallyBar],
        {
          [CameraName.RallyBar]: {
            color: "White",
          },
          [CameraName.WallMountForVideoBars]: {},
        },
        StepName.ConferenceCamera
      );
      permission.processAddActiveElementByName(CameraName.RallyBar);
      const dataForAdd = permission.getDataForAdd();

      expect(dataForAdd).toEqual({
        [StepName.ConferenceCamera]: [CameraName.WallMountForVideoBars],
      });
    });
  });

  describe("getDataForRemove", () => {
    test("Removing Active Element by Name with Single Cameras", () => {
      const permission = new Permission(
        [CameraName.WallMountForVideoBars],
        {
          [CameraName.RallyBar]: {
            color: "White",
          },
          [CameraName.WallMountForVideoBars]: {},
        },
        StepName.ConferenceCamera
      );
      permission.processRemoveActiveElementByName(CameraName.RallyBar);
      const dataForRemove = permission.getDataForRemove();
      expect(dataForRemove).toEqual({
        [StepName.ConferenceCamera]: [CameraName.WallMountForVideoBars],
      });
    });
  });
});
