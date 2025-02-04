import { Condition } from "../../models/conditions/Condition";

export enum ColumnNameDimension {
  ROOM_SIZE = "room_size",
  CAMERA = "camera",
  MIC_POD_COUNT = "mic_pod_count",
  SIGHT_PRESENT = "sight_present",
  ROOM_WIDTH_METER = "RW_METER",
  ROOM_LENGTH_METER = "RL_METER",
  CAMERA_TO_MIC_POD_METER = "CTM_METER",
  MIC_POD_TO_MIC_POD_METER = "MTM_METER",
  EXCEPTION_METER = "exception_METER",
  TABLE_L_METER = "TABLE_L_METER",
  TABLE_W_METER = "TABLE_W_METER",
}

export interface DimensionDataI {
  conditions: Condition[];
  data: Record<ColumnNameDimension, string>;
}
