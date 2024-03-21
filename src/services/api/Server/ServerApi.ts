import { BaseApi } from "../BaseApi";

// http://localhost:80/products/en-us
export class ServerApi extends BaseApi {
  constructor() {
    const baseUrl = `http://localhost:80/`;
    super(baseUrl);
  }

  public async getProductsLang(languageCode: string) {
    return this.axiosInstance.get(`/products/${languageCode}`);
  }
}
