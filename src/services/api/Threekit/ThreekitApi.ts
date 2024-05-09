import { ConfigData } from "../../../utils/threekitUtils";
import { BaseApi } from "../BaseApi";
import { DataCreateOrderI, DataGetOrdersI } from "./type";

export class ThreekitApi extends BaseApi {
  private PUBLIC_TOKEN: string;
  private ORG_ID: string;

  constructor() {
    const baseUrl = `https://${ConfigData.host}/api`;
    super(baseUrl);
    //this.PUBLIC_TOKEN = ConfigData.publicToken;
   // this.ORG_ID = ConfigData.orgId;
    this.PUBLIC_TOKEN = "7e11f965-c7e3-4642-b721-c5d201b482ed";
    this.ORG_ID = "04015bb6-401d-47f8-97c0-dd6fa759c441";
  }

  public async getAssetById(assetId: string) {
    return this.axiosInstance.get(`/assets/${assetId}`, {
      headers: {
        Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        bearer_token: this.PUBLIC_TOKEN,
      },
      baseURL: `https://${ConfigData.host}/api/v2`,
    });
  }

  public async getAssetsByTag(tagId?: string) {
    return this.axiosInstance.get(`/assets`, {
      headers: {
        Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        bearer_token: this.PUBLIC_TOKEN,
        tags: tagId,
      },
      baseURL: `https://${ConfigData.host}/api/v2`,
    });
  }

  public async getDataTablesById(dataTableId: string) {
    return this.axiosInstance.get(`/datatables/${dataTableId}/rows`, {
      headers: {
        Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        bearer_token: this.PUBLIC_TOKEN,
        orgId: this.ORG_ID,
        all: true,
      },
    });
  }

  public async getOrders(data: DataGetOrdersI) {
    return this.axiosInstance.get(`/orders`, {
      headers: {
        Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        bearer_token: this.PUBLIC_TOKEN,
        orgId: this.ORG_ID,
        ...data,
      },
    });
  }

  public async createOrder(orderData: DataCreateOrderI) {
    return this.axiosInstance.post(
      `/orders?bearer_token=${this.PUBLIC_TOKEN}&orgId=${this.ORG_ID}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  }

  public async updateOrder(id: string, orderData: Partial<DataCreateOrderI>) {
    return this.axiosInstance.put(
      `/orders/${id}?bearer_token=${this.PUBLIC_TOKEN}&orgId=${this.ORG_ID}`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${this.PUBLIC_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
