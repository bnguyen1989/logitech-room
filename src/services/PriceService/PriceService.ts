import { DataTable } from "../../models/dataTable/DataTable";
import { ThreekitService } from "../Threekit/ThreekitService";
import { DataProductI, ProductsDataI } from "./type";

export class PriceService {
  private pangea = window.pangea;

  public async getDataProductBySku(sku: string): Promise<DataProductI> {
    const data = await this.getProductData([sku]);
    const dataProduct = data[sku];
    if (!dataProduct) return {};
    const sale = dataProduct.prices.sale.amount;
    const list = dataProduct.prices.list.amount;
    return {
      price: sale,
      strikeThroughPrice: sale < list ? list : undefined,
      inStock: dataProduct.inStock,
    };
  }

  public async getProductData(productIDs: string[]): Promise<ProductsDataI> {
    if (!this.pangea) {
      return {};
    }
    const response = this.pangea.storeManager.getProductData(productIDs);
    return response;
  }

  public formatPrice(value: number, currency: string) {
    if (!this.pangea) return value.toString();
    return this.pangea.storeManager.formatPrice(value, currency);
  }

  public getDataTablePriceSoftwareServices() {
    return new ThreekitService()
      .getDataTablesById("f3d2c17e-db6d-49f4-a123-c91bd6c5b0bb")
      .then((data) => {
        const dataTable = new DataTable(data);
        return dataTable;
      });
  }

  public getPriceForSoftwareServices(
    dataTable: DataTable,
    locale: string,
    sku: string,
    name?: string
  ) {
    let dataRows = dataTable
      .getDataRowsByValue("locale", locale)
      .filter((row) => row.value["sku"] === sku);

    if (dataRows.length > 1 && name) {
      dataRows = dataRows.filter(
        (row) => row.value["Description"].toLowerCase() === name?.toLowerCase()
      );
    }

    let value: string | undefined;
    if (dataRows.length) {
      value = dataRows[0].value["price"];
    }

    return value ? parseFloat(value) : undefined;
  }
}
