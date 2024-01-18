import { z } from 'zod';

import { create } from '../../operators/create.js';
import { deleteById } from '../../operators/deleteById.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { restoreById } from '../../operators/restoreById.js';
import { updateById } from '../../operators/updateById.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

const WebhookBase = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  topic: z.string(),
  address: z.string().url(),
  filter: z.object({
    status: z.array(
      z.union([
        z.literal('success'),
        z.literal('failed'),
        z.literal('In Progress'),
        z.literal('List'),
        z.literal('Complete'),
        z.literal('New'),
        z.literal('In Cart')
      ])
    ),
    type: z.array(z.string()).optional()
  })
});

export const Webhook = EntityMetadata.merge(WebhookBase);
export type Webhook = z.infer<typeof Webhook>;

export const WebhookResponse = z.object({
  webhook: EntityMetadata.merge(WebhookBase)
});
export type WebhookResponse = z.infer<typeof WebhookResponse>;

export const WebhookListing = Pagination.merge(
  z.object({
    webhooks: z.array(EntityMetadata.merge(WebhookBase))
  })
);
export type WebhookListing = z.infer<typeof WebhookListing>;

export const CreateWebhookProps = Webhook.pick({
  orgId: true,
  topic: true,
  address: true,
  filter: true
}).partial({ orgId: true });

export type CreateWebhookProps = z.infer<typeof CreateWebhookProps>;

export const UpdateWebhookProps = Webhook.pick({
  topic: true,
  address: true,
  filter: true
}).partial();
export type UpdateWebhookProps = z.infer<typeof UpdateWebhookProps>;

export type QueryWebhookProps = any;

const API_ROUTE = `/api/webhooks`;

export class Webhooks extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  create(createProps: CreateWebhookProps) {
    return create<CreateWebhookProps, WebhookResponse>(this.context, {
      orgId: this.context.auth.orgId,
      ...createProps
    });
  }

  deleteById(id: string) {
    const webhookId = z.string().uuid().parse(id);
    return deleteById<WebhookResponse>(this.context, webhookId);
  }

  get(queryProps?: QueryWebhookProps) {
    return get<QueryWebhookProps, WebhookListing>(this.context, queryProps);
  }

  getById(id: string) {
    const webhookId = z.string().uuid().parse(id);
    return getById<WebhookResponse>(this.context, webhookId);
  }

  restoreById(id: string) {
    const webhookId = z.string().uuid().parse(id);
    return restoreById<WebhookResponse>(this.context, webhookId);
  }

  updateById(id: string, updateProps: UpdateWebhookProps) {
    const webhookId = z.string().uuid().parse(id);
    return updateById<UpdateWebhookProps, WebhookListing>(
      this.context,
      webhookId,
      updateProps
    );
  }
}
