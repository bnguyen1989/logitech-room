import { QueryAssetProps, ThreekitClient } from '@threekit/rest-api';
import Koa from 'koa';
import { z } from 'zod';

import { threekitAuth } from '../../utils/threekitAuth.js';

// Define a schema using Zod
const QueryProps = z.object({
  tag: z.string().optional(),
  keyword: z.string().optional()
});

// Infer the type from the schema
type QueryProps = z.infer<typeof QueryProps>;

export const getProducts = async (ctx: Koa.Context) => {
  // Parse the query string using Zod
  const queryProps: QueryProps = QueryProps.parse(ctx.request.query);

  const threekitClient = new ThreekitClient(threekitAuth);

  // construct a query object
  const queryAssetProps: QueryAssetProps = {
    type: 'item'
  };
  if (queryProps.tag) queryAssetProps.tags = [queryProps.tag];
  if (queryProps.keyword) queryAssetProps.keywords = [queryProps.keyword];

  const result = await threekitClient.assets.get(queryAssetProps);
  ctx.body = result.data;
};
