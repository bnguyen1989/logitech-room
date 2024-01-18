import { User, UserListing, Users, UserSession } from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const usersEndpoints = (build: RestApiEndpointBuilder) => ({
  usersGet: build.query<User[], void>({
    query: () => (auth) => new Users(auth).get(),
    transformResponse: (response: UserListing) => response.users,
    providesTags: (users) =>
      [{ id: 'PARTIAL-LIST' }, users ?? []].flat().map((user) => ({
        type: TAGS.USERS as const,
        id: user.id
      }))
  }),

  usersGetById: build.query<User, string>({
    query: (id) => (auth) => new Users(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.TAGS, id }]
  }),

  usersGetSession: build.mutation<UserSession, void>({
    query: () => (auth) => new Users(auth).getSession()
  })
});
