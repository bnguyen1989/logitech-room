import { z } from 'zod';

import { create } from '../../operators/create.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import {
  Configuration,
  EntityMetadata,
  Metadata,
  Pagination
} from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const EventType = z.enum([
  'product download',
  'product session start',
  'product session end',
  'product configuration start',
  'product configuration attribute set',
  'product cart-add',
  'product ordered',
  'product social share',
  'product AR not available',
  'product AR offered',
  'product AR download',
  'product AR mobile transition offered',
  'product AR mobile transition completed'
]);
export type EventType = z.infer<typeof EventType>;

const EventBase = z.object({
  eventType: EventType,
  eventMetadata: Metadata,
  assetId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  sessionId: z.string().uuid().nullable(),
  configId: z.string().uuid().nullable(),
  configuration: Configuration.nullable(),
  device: z.string().nullable(),
  metric: z.number().nullable()
});

export const Event = EntityMetadata.merge(EventBase);
export type Event = z.infer<typeof Event>;

export const EventListing = Pagination.merge(
  z.object({
    events: z.array(Event)
  })
);
export type EventListing = z.infer<typeof EventListing>;

export const CreateEventProps = EventBase;
export type CreateEventProps = z.infer<typeof CreateEventProps>;

export const QueryEventProps = z.object({
  orgId: z.string().uuid().nullable(),
  metadata: Metadata,
  device: z.string().nullable(),
  referer: z.string().nullable()
});
export type QueryEventProps = z.infer<typeof QueryEventProps>;

const API_ROUTE = `/api/analytics`;

export class Analytics extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  create(createProps: CreateEventProps) {
    return create<CreateEventProps, Event>(this.context, {
      ...createProps
    });
  }

  get(queryProps?: QueryEventProps) {
    return get<QueryEventProps, EventListing>(this.context, queryProps);
  }

  getById(id: string) {
    const appId = z.string().uuid().parse(id);
    return getById<Event>(this.context, appId);
  }
}
