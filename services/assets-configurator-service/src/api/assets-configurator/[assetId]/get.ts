import { createStore, initializeProduct } from '@threekit/configurator';
import Koa from 'koa';
import { z } from 'zod';

const GetConfiguratorQuery = z.object({
  assetId: z.string().uuid(),
  host: z.union([z.literal('preview'), z.literal('admin-fts'), z.string()]),
  orgId: z.string().uuid(),
  publicToken: z.string().uuid()
});

export const getConfigurator = async (ctx: Koa.Context) => {
  const query = GetConfiguratorQuery.safeParse({
    // @ts-ignore
    assetId: ctx.request.params.assetId,
    host: ctx.request.query.host,
    orgId: ctx.request.query.orgId,
    publicToken: ctx.request.query.publicToken
  });

  if (!query.success) {
    ctx.body = query.error;
    return;
  }

  const store = createStore({
    host: ['preview', 'admin-fts'].includes(query.data.host)
      ? `${query.data.host}.threekit.com`
      : `${query.data.host}.threekit.dev`,
    orgId: query.data.orgId,
    publicToken: query.data.publicToken
  });

  const product = await store.dispatch(initializeProduct(query.data.assetId));
  if (product) ctx.body = product?.product;
  else ctx.body = 'Error requesting asset';
};
