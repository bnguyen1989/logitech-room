import { StepName } from "../../utils/baseUtils";
import { DataTable } from "../dataTable/DataTable";
import { Permission } from "../permission/Permission";
import { DimensionNodeData } from "./type";

export class Dimension {
  private permissionElement: Permission;
  private dataTable: DataTable;
  private dimensionNodeData: DimensionNodeData[] = [];

  public static metersToFeet(meters: number): number {
    const conversionFactor = 3.280839895;
    return Math.floor(meters * conversionFactor * 10) / 10;
  }

  constructor(permissionElement: Permission, dataTable: DataTable) {
    this.permissionElement = permissionElement;
    this.dataTable = dataTable;
    this.buildDimension();
  }

  public buildDimension(): void {
    const roomStep = this.permissionElement.getStepByName(StepName.RoomSize);
    const [activeRoom] = roomStep.getActiveElements();
    const [data] = this.dataTable.getDataRowsByValue(
      "room_size",
      activeRoom.name
    );

    const colNameRoomWidth = "RW_METER";
    const colNameRoomLength = "RL_METER";
    const roomWidthMeter = data.value[colNameRoomWidth];
    const roomLengthMeter = data.value[colNameRoomLength];

    const roomWidthFeet = Dimension.metersToFeet(parseFloat(roomWidthMeter));
    const roomLengthFeet = Dimension.metersToFeet(parseFloat(roomLengthMeter));

    this.dimensionNodeData = [
      {
        label: `${roomLengthFeet} ft / ${roomLengthMeter} m`,
        nodeAName: "Room_Length_1",
        nodeBName: "Room_Length_2",
      },
      {
        label: `${roomWidthFeet} ft / ${roomWidthMeter} m`,
        nodeAName: "Room_Width_1",
        nodeBName: "Room_Width_2",
      },
    ];
  }

  public getDataDimension(): DimensionNodeData[] {
    return [...this.dimensionNodeData];
  }
}
