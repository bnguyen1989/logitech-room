import {
  Webhook,
  WebhookListing,
  WebhookResponse,
  Webhooks
} from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';

export const webhooksEndpoints = (build: RestApiEndpointBuilder) => ({
  webhooksGet: build.query<Webhook[], void>({
    query: () => (auth) => new Webhooks(auth).get(),
    transformResponse: (response: WebhookListing) => response.webhooks,
    providesTags: (webhooks) =>
      [{ id: 'PARTIAL-LIST' }, webhooks ?? []].flat().map((webhook) => ({
        type: TAGS.WEBHOOKS as const,
        id: webhook.id
      }))
  }),

  webhooksGetById: build.query<Webhook, string>({
    query: (id) => (auth) => new Webhooks(auth).getById(id),
    transformResponse: (response: WebhookResponse) => response.webhook,
    providesTags: (_r, _e, id) => [{ type: TAGS.WEBHOOKS, id }]
  }),

  // webhooksCreate: build.mutation<Tag, CreateWebhookProps>({
  //   query: (webhook) => (auth) => new Webhooks(auth).create(webhook),
  //   invalidatesTags: (app) => (app ? [{ type: TAGS.TAGS, id: app.id }] : [])
  // }),

  // webhooksUpdateById: build.mutation<Webhook, { id: string; webhook: WebhookUp }>({
  //   query: (args) => (auth) => new Tags(auth).updateById(args.id, args.tag),
  //   invalidatesTags: (_r, _e, { id }) => [{ type: TAGS.TAGS, id }]
  // }),

  webhooksDeleteById: build.mutation<Webhook, string>({
    query: (id) => (auth) => new Webhooks(auth).deleteById(id),
    invalidatesTags: (_r, _e, id) => [{ type: TAGS.TAGS, id }]
  })
});
