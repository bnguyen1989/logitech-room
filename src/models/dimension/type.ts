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
