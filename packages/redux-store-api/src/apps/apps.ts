import {
  App,
  AppListing,
  Apps,
  CreateAppProps,
  UpdateAppProps
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const appsEndpoints = (build: RestApiEndpointBuilder) => ({
  appsGet: build.query<App[], void>({
    query: () => (auth) => new Apps(auth).get(),
    transformResponse: (response: AppListing) => response.apps,
    providesTags: (apps) =>
      [{ id: 'PARTIAL-LIST' }, apps ?? []].flat().map((app) => ({
        type: TAGS.APPS as const,
        id: app.id
      }))
  }),

  appsGetById: build.query<App, string>({
    query: (id) => (auth) => new Apps(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.APPS, id }]
  }),

  appsCreate: build.mutation<App, CreateAppProps>({
    query: (app) => (auth) => new Apps(auth).create(app),
    invalidatesTags: (app) => (app ? [{ type: TAGS.APPS, id: app.id }] : [])
  }),

  appsUpdateById: build.mutation<App, { id: string; app: UpdateAppProps }>({
    query: (args) => (auth) => new Apps(auth).updateById(args.id, args.app),
    invalidatesTags: (_r, _e, { id }) => [{ type: TAGS.APPS, id }]
  }),

  appsDeleteById: build.mutation<App, string>({
    query: (id) => (auth) => new Apps(auth).deleteById(id),
    invalidatesTags: (_r, _e, id) => [{ type: TAGS.APPS, id }]
  })
});
