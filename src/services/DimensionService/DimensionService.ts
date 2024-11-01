import { Condition } from "../../models/conditions/Condition";
import {
  ConditionPropertyName,
  OperatorName,
} from "../../models/conditions/type";
import { DataTable } from "../../models/dataTable/DataTable";
import { AudioExtensionName, CameraName } from "../../utils/permissionUtils";
import { getDimensionTableId } from "../../utils/threekitUtils";
import { ThreekitService } from "../Threekit/ThreekitService";
import { ColumnNameDimension, DimensionDataI } from "./type";
import { DataTableRowI } from "../../models/dataTable/type";

export class DimensionService {
  public static isN_A(value: string) {
    return value.toLowerCase().includes("n/a");
  }

  public static isAny(value: string) {
    return value.toLowerCase().includes("any");
  }

  public static isAllCameras(value: string) {
    return value.toLowerCase().includes("all cameras");
  }

  public async getDimensionTable(): Promise<DataTable> {
    const dataTableId = getDimensionTableId();
    const data = await new ThreekitService().getDataTablesById(dataTableId);
    return new DataTable(data).setAssetId(dataTableId);
  }

  public getDimensionDataByTable(dataTable: DataTable): DimensionDataI[] {
    return dataTable.data.map((row) => this.buildDimensionData(row));
  }

  private buildDimensionData(row: DataTableRowI): DimensionDataI {
    const dataDimension = this.getDataDimensionByDataRow(row);
    let result: DimensionDataI = { conditions: [], data: dataDimension };

    result = this.addKeyPermissionConditions(row, result);
    result = this.addPropertyConditions(row, result);

    return result;
  }

  private addKeyPermissionConditions(
    row: DataTableRowI,
    data: DimensionDataI
  ): DimensionDataI {
    const keyCols = this.getKeyPermissionColumnNames();
    keyCols.forEach((keyCol) => {
      const value = row.value[keyCol];
      if (!DimensionService.isAllCameras(value)) {
        const condition = new Condition(value).addProperty(
          ConditionPropertyName.ACTIVE,
          true
        );
        data.conditions.push(condition);
      }
    });
    return data;
  }

  private addPropertyConditions(
    row: DataTableRowI,
    data: DimensionDataI
  ): DimensionDataI {
    Object.entries(this.getPropertyColumnNames()).forEach(
      ([keyCol, keyPermission]) => {
        const value = row.value[keyCol];
        if (!DimensionService.isAny(value)) {
          const condition = this.buildCondition(value, keyPermission);
          data.conditions.push(condition);
        }
      }
    );
    return data;
  }

  private buildCondition(value: string, keyPermission: string): Condition {
    const condition = new Condition(keyPermission);
    if (this.isCountCondition(value)) {
      const numberValue = parseFloat(value.replace("+", ""));
      condition.addProperty(ConditionPropertyName.ACTIVE, numberValue !== 0);

      if (!isNaN(numberValue) && numberValue !== 0) {
        condition
          .addProperty(ConditionPropertyName.COUNT, numberValue)
          .addOperatorProperty(
            ConditionPropertyName.COUNT,
            value.includes("+")
              ? OperatorName.GREATER_OR_EQUAL
              : OperatorName.EQUAL
          );
      }
    } else {
      condition.addProperty(
        ConditionPropertyName.ACTIVE,
        value.toLowerCase() === "yes"
      );
    }
    return condition;
  }

  private isCountCondition(value: string): boolean {
    return !isNaN(Number(value)) || value.includes("+");
  }

  private getDataDimensionByDataRow(
    row: DataTableRowI
  ): Record<ColumnNameDimension, string> {
    return Object.entries(row.value).reduce<
      Record<ColumnNameDimension, string>
    >((acc, [key, value]) => {
      if (
        this.getPropertyColumnNames()[key as ColumnNameDimension] ||
        DimensionService.isN_A(value)
      )
        return acc;
      acc[key as ColumnNameDimension] = value;
      return acc;
    }, {} as Record<ColumnNameDimension, string>);
  }

  private getPropertyColumnNames(): Record<string, string> {
    return {
      [ColumnNameDimension.MIC_POD_COUNT]: AudioExtensionName.RallyMicPod,
      [ColumnNameDimension.SIGHT_PRESENT]: CameraName.LogitechSight,
    };
  }

  private getKeyPermissionColumnNames(): string[] {
    return [ColumnNameDimension.ROOM_SIZE, ColumnNameDimension.CAMERA];
  }
}
