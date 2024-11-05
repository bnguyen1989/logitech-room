import {
  AudioExtensionName,
  CameraName,
  RoomSizeName,
} from "../../utils/permissionUtils";
import { Condition } from "../conditions/Condition";
import { ConditionPropertyName, OperatorName } from "../conditions/type";
import { PlacementManager } from "../configurator/PlacementManager";
import { RoadMapDimensionI } from "./type";

export const getRoadMapDimensionByRoom = (): RoadMapDimensionI => {
  const data: RoadMapDimensionI = {
    [RoomSizeName.Auditorium]: [
      {
        conditions: [
          new Condition(CameraName.RallyPlus).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 4)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[1, 4]],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyPlus).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 5)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [
              [1, 4],
              [2, 5],
            ],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicWithoutSight(),
            orderMicPods: [[2, 1]],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicWithoutSight(),
            orderMicPods: [[2, 1, 3]],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 4)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicWithoutSight(),
            orderMicPods: [
              [2, 1, 3],
              [2, 4],
            ],
          },
        },
      },
    ],
    [RoomSizeName.Large]: [
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 0,
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 1),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicSingle(),
            orderMicPods: [[1]],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 1),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[1]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 0,
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyPlus).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 0,
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight2(),
            indexPositionSight: 0,
          },
        },
      },

      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight2(),
            indexPositionSight: 0,
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyBar).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[3, 2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.RallyPlus).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[3, 2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
        },
      },
    ],
    [RoomSizeName.Medium]: [
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 1),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicSingle(),
            orderMicPods: [[1]],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 1),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[1]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 1,
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicWithoutSight(),
            orderMicPods: [[1, 2]],
            offsetPosition: [-0.5, 0, 0],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 2),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[1, 2]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 1,
          },
        },
      },

      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            false
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMic(),
            orderMicPods: [[3, 2, 1]],
            offsetPosition: [-0.5, 0, 0],
          },
        },
      },
      {
        conditions: [
          new Condition(CameraName.LogitechSight).addProperty(
            ConditionPropertyName.ACTIVE,
            true
          ),
          new Condition(AudioExtensionName.RallyMicPod)
            .addProperty(ConditionPropertyName.ACTIVE, true)
            .addProperty(ConditionPropertyName.COUNT, 3)
            .addOperatorProperty(
              ConditionPropertyName.COUNT,
              OperatorName.GREATER_OR_EQUAL
            ),
        ],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: PlacementManager.getNameNodeForMicDouble(),
            orderMicPods: [[1, 2]],
            offsetPosition: [-0.5, 0, 0],
          },
          sight: {
            nodeName: PlacementManager.getNameNodeForSight(),
            indexPositionSight: 1,
          },
        },
      },
    ],
    [RoomSizeName.Small]: [
      {
        conditions: [],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: "",
            orderMicPods: [],
          },
        },
      },
    ],
    [RoomSizeName.Huddle]: [
      {
        conditions: [],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: "",
            orderMicPods: [],
          },
        },
      },
    ],
    [RoomSizeName.Phonebooth]: [
      {
        conditions: [],
        data: {
          camera: {
            nodeName: PlacementManager.getNameNodeCommodeForCamera(
              "RallyBar",
              2
            ),
          },
          micPod: {
            nodeName: "",
            orderMicPods: [],
          },
        },
      },
    ],
  };

  return data;
};
