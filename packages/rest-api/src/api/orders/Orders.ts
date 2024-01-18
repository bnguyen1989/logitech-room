import { z } from 'zod';

import { create } from '../../operators/create.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import { Caching, EntityMetadata, Metadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const CartItem = z.object({
  configurationId: z.string().uuid(),
  count: z.number().min(1),
  metadata: Metadata.optional()
});
export type CartItem = z.infer<typeof CartItem>;

export const Order = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    orgId: z.string().uuid(),
    shortId: z.string().regex(/^[a-zA-Z0-9_-]{7,14}$/),
    name: z.string().nullable(),
    status: z.union([
      z.literal('List'),
      z.literal('In Cart'),
      z.literal('New'),
      z.literal('In Progress'),
      z.literal('Complete')
    ]),
    metadata: Metadata,
    platform: z.object({
      id: z.string().optional().nullable(),
      platform: z.string().optional(),
      storeName: z.string().optional().nullable()
    }),
    cart: z.array(CartItem).min(1),
    items: z.array(z.string()).max(0),
    derivative: z.record(z.string()),
    customerId: z.string().uuid().nullable()
  })
);
export type Order = z.infer<typeof Order>;

export const OrderListing = Pagination.merge(
  z.object({
    orders: Order.array()
  })
);
export type OrderListing = z.infer<typeof OrderListing>;

export const CreateOrderProps = Order.pick({
  platform: true,
  orgId: true,
  cart: true,
  name: true,
  status: true,
  metadata: true,
  customerId: true
}).partial({
  name: true,
  status: true,
  metadata: true,
  customerId: true
});
export type CreateOrderProps = z.infer<typeof CreateOrderProps>;

export type QueryOrderProps = object; // TODO: This should be defined.

const API_ROUTE = `/api/orders`;

export class Orders extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  create(createProps: CreateOrderProps) {
    return create<CreateOrderProps, Order>(this.context, {
      ...createProps,
      orgId: this.context.auth.orgId
    });
  }

  get(queryProps?: QueryOrderProps) {
    return get<QueryOrderProps, OrderListing>(this.context, queryProps);
  }

  getById(id: string, caching: Caching = {}) {
    const orderId = z.string().uuid().parse(id);
    return getById<Order>(this.context, orderId, caching);
  }

  addToOrder(id: string, itemsToAdd: CartItem[]) {
    const orderId = z.string().uuid().parse(id);
    return request<Order>(this.context, {
      method: 'POST',
      url: `${orderId}/cart`,
      data: itemsToAdd
    });
  }

  // TODO: Confirm this is remove, I Think it just replacing the existing cart with the new cart.
  removeFromOrder(id: string, itemsToRemove: CartItem[]) {
    const orderId = z.string().uuid().parse(id);

    console.warn(
      'This may not remove, but rather replacing existing cart with new card.'
    );
    return request<Order>(this.context, {
      method: 'PUT',
      url: `${orderId}/cart`,
      data: itemsToRemove
    });
  }
}
