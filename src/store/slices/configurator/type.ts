export interface DimensionDataI {
  enabled: boolean;
  data: DimensionNodeData[];
}

export interface DimensionNodeData {
  label: string;
  nodeAName: string;
  nodeBName: string;
}
