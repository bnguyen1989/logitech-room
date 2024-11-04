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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          orderMicPods: [[1, 4]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          orderMicPods: [
            [1, 4],
            [2, 5],
          ],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicWithoutSight(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicWithoutSight(),
          orderMicPods: [[2, 1, 3]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicWithoutSight(),
          orderMicPods: [
            [2, 1, 3],
            [2, 4],
          ],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicSingle(),
          orderMicPods: [[1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight2(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight2(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[3, 2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicSingle(),
          orderMicPods: [[1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 1,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicWithoutSight(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[1, 2]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 1,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[1, 2]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMic(),
          indexSight: 0,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[3, 2, 1]],
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
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
          indexSight: 1,
          nodeSight: PlacementManager.getNameNodeForSight(),
          orderMicPods: [[1, 2]],
        },
      },
    ],
    [RoomSizeName.Small]: [
      {
        conditions: [],
        data: {
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: "",
          orderMicPods: [],
        },
      },
    ],
    [RoomSizeName.Huddle]: [
      {
        conditions: [],
        data: {
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: "",
          orderMicPods: [],
        },
      },
    ],
    [RoomSizeName.Phonebooth]: [
      {
        conditions: [],
        data: {
          nodeCamera: PlacementManager.getNameNodeCommodeForCamera(
            "RallyBar",
            2
          ),
          nodeMicPod: "",
          orderMicPods: [],
        },
      },
    ],
  };

  return data;
};
