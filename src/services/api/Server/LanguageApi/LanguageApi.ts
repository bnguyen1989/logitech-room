import { ServerApi } from '../ServerApi'

export class LanguageApi extends ServerApi {
		
		public async getLanguageData(languageCode: string) {
				return this.axiosInstance.get(`/languages/${languageCode}`);
		}
}