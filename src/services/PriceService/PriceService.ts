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
}
