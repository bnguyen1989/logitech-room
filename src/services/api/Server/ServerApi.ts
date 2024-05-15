import { BaseApi } from "../BaseApi";

export class ServerApi extends BaseApi {
  public static getUrlApi() {
    let link = window.location.origin;

    if (process.env.NODE_ENV === "development") {
      link = "http://localhost:3000";
    }
    return link;
  }
  constructor() {
    const baseUrl = ServerApi.getUrlApi();
    super(baseUrl);
  }
}
