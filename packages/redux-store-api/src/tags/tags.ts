import {
  CreateTagProps,
  Tag,
  TagListing,
  Tags,
  UpdateTagProps
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const tagsEndpoints = (build: RestApiEndpointBuilder) => ({
  tagsGet: build.query<Tag[], void>({
    query: () => (auth) => new Tags(auth).get(),
    transformResponse: (response: TagListing) => response.tags,
    providesTags: (tags) =>
      [{ id: 'PARTIAL-LIST' }, tags ?? []].flat().map((tag) => ({
        type: TAGS.TAGS as const,
        id: tag.id
      }))
  }),

  tagsGetById: build.query<Tag, string>({
    query: (id) => (auth) => new Tags(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.TAGS, id }]
  }),

  tagsCreate: build.mutation<Tag, CreateTagProps>({
    query: (tag) => (auth) => new Tags(auth).create(tag),
    invalidatesTags: (tag) => (tag ? [{ type: TAGS.TAGS, id: tag.id }] : [])
  }),

  tagsUpdateById: build.mutation<Tag, { id: string; tag: UpdateTagProps }>({
    query: (args) => (auth) => new Tags(auth).updateById(args.id, args.tag),
    invalidatesTags: (_r, _e, { id }) => [{ type: TAGS.TAGS, id }]
  }),

  tagsDeleteById: build.mutation<Tag, string>({
    query: (id) => (auth) => new Tags(auth).deleteById(id),
    invalidatesTags: (_r, _e, id) => [{ type: TAGS.TAGS, id }]
  })
});
