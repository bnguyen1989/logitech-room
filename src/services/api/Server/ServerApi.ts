import { BaseApi } from "../BaseApi";

export class ServerApi extends BaseApi {
  public static getUrlApi() {
    let link = "https://staging.project--logitech.pages.dev";

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
