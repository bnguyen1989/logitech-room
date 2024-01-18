import {
  Asset,
  AssetListing,
  Assets,
  type LocaleTranslations
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';
export const assetsEndpoints = (build: RestApiEndpointBuilder) => ({
  assetsGetById: build.query<Asset, string>({
    query: (id) => (auth) => new Assets(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  }),
  assetsGet: build.query<Asset[], object | undefined | void>({
    query: (query) => (auth) => new Assets(auth).get(query ?? undefined),
    transformResponse: (response: AssetListing) => response.assets,
    providesTags: (assets) =>
      [{ id: 'PARTIAL-LIST' }, assets ?? []].flat().map((asset) => ({
        type: TAGS.ASSETS as const,
        id: asset.id
      }))
  }),
  translationsGetByLocale: build.query<LocaleTranslations, string>({
    query: (locale) => (auth) =>
      new Assets(auth).getTranslationsByLocale(locale),
    providesTags: (_r, _e, locale) => [{ type: TAGS.TRANSLATIONS, id: locale }]
  })
});
