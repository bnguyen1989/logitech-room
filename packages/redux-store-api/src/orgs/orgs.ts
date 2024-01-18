import { Org, Orgs } from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const orgsEndpoints = (build: RestApiEndpointBuilder) => ({
  orgsGetById: build.query<Org, string | undefined | void>({
    query: (id) => (auth) => new Orgs(auth).getById(id ?? undefined),
    providesTags: (org) => (org ? [{ type: TAGS.ORGS, id: org.id }] : [])
  })
});
