import { LanguageApi } from "../api/Server/LanguageApi/LanguageApi";
import { LanguageDataI } from "./type";

export class LanguageService {
  private languageApi: LanguageApi = new LanguageApi();

  public async getLanguageData(languageCode: string): Promise<LanguageDataI> {
    const response = await this.languageApi.getLanguageData(languageCode);
    return response.data;
  }
}
