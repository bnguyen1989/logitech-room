import { RoomSizeName } from "../../utils/permissionUtils";
import { PlacementManager } from "../configurator/PlacementManager";
import { RoadMapDimensionI } from "./type";

export const getRoadMapDimensionByRoom = (): RoadMapDimensionI => {
  const data: RoadMapDimensionI = {
    [RoomSizeName.Auditorium]: [
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMic(),
        orderMicPods: [5, 2, 3, 1, 4],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMicWithoutSight(),
        orderMicPods: [4, 2, 1, 3],
      },
    ],
    [RoomSizeName.Large]: [
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMic(),
        indexSight: 0,
        nodeSight: PlacementManager.getNameNodeForSight(),
        orderMicPods: [],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMicSingle(),
        orderMicPods: [1],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
        indexSight: 0,
        nodeSight: PlacementManager.getNameNodeForSight(),
        orderMicPods: [1],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
        indexSight: 0,
        nodeSight: PlacementManager.getNameNodeForSight(),
        orderMicPods: [2, 1],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMicDouble(),
        indexSight: 0,
        nodeSight: PlacementManager.getNameNodeForSight(),
        orderMicPods: [2, 1],
      },
      {
        nodeCamera: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
        nodeMicPod: PlacementManager.getNameNodeForMic(),
        indexSight: 0,
        nodeSight: PlacementManager.getNameNodeForSight(),
        orderMicPods: [2, 1],
      },
    ],
  };

  return data;
};
