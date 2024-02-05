import { ConfigData } from "../../../utils/threekitUtils";
import { BaseApi } from "../BaseApi";

export class ThreekitApi extends BaseApi {
  private PUBLIC_TOKEN: string;
  // private ORG_ID: string;

  constructor() {
    const baseUrl = `https://${ConfigData.host}/api/v2`;
    super(baseUrl);
    this.PUBLIC_TOKEN = ConfigData.publicToken;
    // this.ORG_ID = ConfigData.orgId;
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
    });
  }
}
