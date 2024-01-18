import {
  Cas,
  type CasHead,
  type CasManifested,
  type CasObject
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const casEndpoints = (build: RestApiEndpointBuilder) => ({
  casGetById: build.query<CasObject, string>({
    query: (id) => (auth) => new Cas(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  }),
  casGetManifestedById: build.query<CasManifested, string>({
    query: (id) => (auth) => new Cas(auth).getManifestedById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  }),
  casGetHeadById: build.query<CasHead, string>({
    query: (id) => (auth) => new Cas(auth).getHeadById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  })
});
