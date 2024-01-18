import { type TranslationResponse, Translations } from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';

export const translationsEndpoints = (build: RestApiEndpointBuilder) => ({
  translationsGet: build.query<TranslationResponse, void>({
    query: () => (auth) => new Translations(auth).get()
  })
});
