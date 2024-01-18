import {
  type CreateSavedConfigurationProps,
  type QuerySavedConfigurationProps,
  type SavedConfiguration,
  type SavedConfigurationListing,
  SavedConfigurations
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const savedConfigurationsEndpoints = (
  build: RestApiEndpointBuilder
) => ({
  savedConfigurationsGetById: build.query<SavedConfiguration, string>({
    query: (id) => (auth) => new SavedConfigurations(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.SAVED_CONFIGURATIONS, id }]
  }),

  savedConfigurationsGet: build.query<
    SavedConfiguration[],
    QuerySavedConfigurationProps | undefined | void
  >({
    query: (query) => (auth) =>
      new SavedConfigurations(auth).get(query ?? undefined),
    transformResponse: (response: SavedConfigurationListing) =>
      response.configurations,
    providesTags: (configurations) =>
      [{ id: 'PARTIAL-LIST' }, configurations ?? []]
        .flat()
        .map((configuration) => ({
          type: TAGS.SAVED_CONFIGURATIONS as const,
          id: configuration.id
        }))
  }),

  savedConfigurationsCreate: build.mutation<
    SavedConfiguration,
    CreateSavedConfigurationProps
  >({
    query: (configuration) => (auth) =>
      new SavedConfigurations(auth).create(configuration),
    invalidatesTags: (configuration) =>
      configuration
        ? [{ type: TAGS.SAVED_CONFIGURATIONS, id: configuration.id }]
        : []
  })
});
