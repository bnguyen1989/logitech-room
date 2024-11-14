import type { ArrVector3T } from "../../types/mathType";
import { Condition } from "../conditions/Condition";

type DimensionNodeDataType = "dimension" | "text";
export interface DimensionNodeData extends DimensionNodeI {
  label: string;
  type?: DimensionNodeDataType;
}

export interface DimensionNodeI {
  nodeAName: string;
  nodeBName: string;
  offsetPosition?: ArrVector3T;
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
  camera: DimensionRoadMapNodeI;
  micPod: MicPodNodeDimensionI;
  sight?: SightNodeDimensionI;
}

interface SightNodeDimensionI extends DimensionRoadMapNodeI {
  indexPositionSight: number;
}
interface MicPodNodeDimensionI extends DimensionRoadMapNodeI {
  orderMicPods: number[][];
}

interface DimensionRoadMapNodeI {
  nodeName: string;
  offsetPosition?: ArrVector3T;
}
