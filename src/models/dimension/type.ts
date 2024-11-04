import { Condition } from "../conditions/Condition";

export interface DimensionNodeData extends DimensionNodeI {
  label: string;
}

export interface DimensionNodeI {
  nodeAName: string;
  nodeBName: string;
}

export interface DataDistanceI {
  meter: number;
  feet: number;
}

export interface RoadMapDimensionI {
  [roomSize: string]: RoadMapItemDimensionI[];
}

export interface RoadMapItemDimensionI {
  conditions: Condition[];
  data: RoadMapItemDimensionDataI;
}

export interface RoadMapItemDimensionDataI {
  nodeCamera: string;
  nodeMicPod: string;
  nodeSight?: string;
  indexSight?: number;
  orderMicPods: number[][];
}
