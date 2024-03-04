import { DataTableRowI } from "./type";

export class DataTable {
  public id: string | null = null;
  private _data: Array<DataTableRowI>;

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

  public getColumnNames(): Array<string> {
    return Object.keys(this._data[0].value);
  }

  public getValuesByColumn(columnName: string): Array<string> {
    return this._data.map((row) => row.value[columnName]);
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
