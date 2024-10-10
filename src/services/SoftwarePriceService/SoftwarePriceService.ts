import { DataTable } from "../../models/dataTable/DataTable";
import { SoftwareServicesName } from "../../utils/permissionUtils";
import { getPriceTableIdBySoftwareService } from "../../utils/threekitUtils";
import { ThreekitService } from "../Threekit/ThreekitService";
import { DataTableRowI } from "../Threekit/type";

export class SoftwarePriceService {
  private tableId: string | null = null;
  private locale: string;
  private softwareServiceName: string;
  private dataTable: DataTable = new DataTable([]);

  constructor(softwareServiceName: string, locale: string) {
    this.softwareServiceName = softwareServiceName;
    this.locale = locale;
    this.changeSoftwareService(softwareServiceName);
  }

  public changeLocale(locale: string) {
    this.locale = locale;
  }

  public changeSoftwareService(softwareServiceName: string) {
    this.softwareServiceName = softwareServiceName;
    this.tableId = getPriceTableIdBySoftwareService(softwareServiceName);
  }

  public async loadData() {
    if (!this.tableId) return Promise.resolve(this.dataTable);
    return new ThreekitService()
      .getDataTablesById(this.tableId)
      .then((data) => {
        const dataTable = new DataTable(data);
        this.dataTable = dataTable;
        return dataTable;
      });
  }

  public getPriceForSoftwareServices(sku: string, name?: string) {
    const dataRows = this.getDataRowsSoftwareByData(sku, name);

    const columnNamePrice = this.getColumnNamePrice(dataRows, sku);

    if (!columnNamePrice) return;

    return this.getPriceByColumnName(columnNamePrice, dataRows);
  }

  private getDataRowsSoftwareByData(sku: string, name?: string) {
    let dataRows = this.getDataRowsPriceLocale();
    dataRows = DataTable.filteringDataRowsByPartialData(dataRows, "sku", sku);

    if (dataRows.length > 1 && name) {
      const key =
        this.softwareServiceName === SoftwareServicesName.ExtendedWarranty
          ? "Description"
          : "service";

      dataRows = DataTable.filteringDataRows(dataRows, key, name);
    }

    return dataRows;
  }

  private getDataRowsPriceLocale() {
    return this.dataTable.getDataRowsByValue("locale", this.locale);
  }

  private getPriceByColumnName(columnName: string, dataRows: DataTableRowI[]) {
    let value: string | undefined;
    if (dataRows.length) {
      value = dataRows[0].value[columnName];
    }

    return this.formatPrice(value);
  }

  private formatPrice(value: string | undefined) {
    return value ? parseFloat(value) : undefined;
  }

  private getColumnNamePrice(dataRows: DataTableRowI[], sku: string) {
    const columnNameSku = DataTable.getColumnNameByRowValue(dataRows, sku);
    if (!columnNameSku) return;
    if (!columnNameSku.includes("_")) return "price";
    const arr = columnNameSku.split("_");
    return `${arr[0]}_price`;
  }
}
