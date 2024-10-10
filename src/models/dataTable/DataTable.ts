import { DataTableRowI } from "./type";

export class DataTable {
  public id: string | null = null;
  public assetId: string | null = null;
  private _data: Array<DataTableRowI>;

  public static filteringDataRows(
    data: Array<DataTableRowI>,
    columnName: string,
    value: string
  ): Array<DataTableRowI> {
    return new DataTable(data).getDataRowsByValue(columnName, value);
  }

  public static filteringDataRowsByPartialData(
    data: Array<DataTableRowI>,
    columnName: string,
    value: string
  ): Array<DataTableRowI> {
    return new DataTable(data).getDataRowsByPartialData(columnName, value);
  }

  public static getColumnNamesByPartialData(
    data: Array<DataTableRowI>,
    value: string
  ): Array<string> {
    return new DataTable(data).getColumnNamesByPartialData(value);
  }

  public static getColumnNameByRowValue(
    data: Array<DataTableRowI>,
    value: string
  ): string | undefined {
    return new DataTable(data).getColumnNameByRowValue(value);
  }

  constructor(data: Array<DataTableRowI>) {
    this._data = data;
  }

  public set data(data: Array<DataTableRowI>) {
    this._data = data;
  }

  public get data(): Array<DataTableRowI> {
    return this._data;
  }

  public setId(id: string | null): DataTable {
    this.id = id;
    return this;
  }

  public setAssetId(assetId: string | null): DataTable {
    this.assetId = assetId;
    return this;
  }

  public getColumnNames(): Array<string> {
    return Object.keys(this._data[0].value);
  }

  public getValuesByColumn(columnName: string): Array<string> {
    return this._data.map((row) => row.value[columnName]);
  }

  public getDataRowsByValue(
    columnName: string,
    value: string
  ): DataTableRowI[] {
    return this._data.filter(
      (row) => row.value[columnName].toLowerCase() === value.toLowerCase()
    );
  }

  public getDataRowsByPartialData(
    columnName: string,
    value: string
  ): DataTableRowI[] {
    if (!value) return [];
    return this._data.filter((row) => {
      const keys = this.getColumnNames().filter((key) =>
        key.includes(columnName)
      );
      return keys.some((key) =>
        row.value[key].toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  public getColumnNamesByPartialData(columnName: string): Array<string> {
    return this._data
      .map((row) => Object.keys(row.value))
      .reduce((acc, keys) => {
        keys.forEach((key) => {
          if (key.toLowerCase().includes(columnName.toLowerCase())) {
            acc.push(key);
          }
        });
        return acc;
      }, [])
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  public getColumnNameByRowValue(value: string) {
    const row = this._data.find((row) =>
      Object.values(row.value).includes(value)
    );
    if (row) {
      return Object.keys(row.value).find((key) => row.value[key] === value);
    }
  }

  public isEmpty(): boolean {
    return this._data.length === 0;
  }

  public copy(): DataTable {
    return new DataTable(
      this._data.map((row) => ({ ...row, value: { ...row.value } }))
    ).setId(this.id);
  }
}
