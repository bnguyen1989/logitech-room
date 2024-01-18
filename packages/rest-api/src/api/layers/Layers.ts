import { z } from 'zod';

import { get } from '../../operators/get.js';
import { getUri } from '../../operators/getUri.js';
import { request } from '../../operators/request.js';
import { Caching, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

// Incomplete: only contains GET routes

export const Layer = z.object({
  id: z.string().uuid(), // id of the layer, not the asset
  assetId: z.string().uuid(),
  assetLayer: z.string().uuid(), // same as assetId?
  orgId: z.string().uuid(),
  assetVersion: z.string(),
  assetLayerConfiguration: z.object<any>({}),
  stageId: z.union([z.string().uuid(), z.literal('')]),
  stageConfiguration: z.object<any>({}),
  metadata: z.record(z.string(), z.any()),
  stageMetadata: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .nullable(),
  jobId: z.string().uuid(),
  taskId: z.string().uuid(),
  fileId: z.string().uuid(),
  createdAt: z.string().datetime(),
  format: z.union([z.literal('png'), z.literal('glb'), z.literal('usdz')]),
  width: z.number().nullable(),
  height: z.number().nullable(),
  sceneGraphState: z.string().uuid().nullable(),
  assetLayerConfigurationHash: z.string().nullable(),
  stageConfigurationHash: z.string().nullable()
});
export type Layer = z.infer<typeof Layer>;

export const LayerWithFile = Layer.merge(
  z.object({
    url: z.string().url(),
    path: z.string()
  })
);
export type LayerWithFile = z.infer<typeof LayerWithFile>;

export const QueryLayerProps = Layer.merge(
  z.object({
    groupBy: z.string(),
    groupPage: z.union([z.number(), z.string()]),
    groupPerpage: z.union([z.number(), z.string()]),
    optimization: z
      .object({
        width: z.number().nullable(),
        height: z.number().nullable(),
        format: z
          .union([
            z.literal('png'),
            z.literal('jpg'),
            z.literal('webp'),
            z.literal('glb'),
            z.literal('usdz')
          ])
          .nullable(),
        quality: z.number().nullable()
      })
      .partial()
  })
)
  .merge(Caching)
  .partial();
export type QueryLayerProps = z.infer<typeof QueryLayerProps>;

export const LayerListing = Pagination.merge(
  z.object({
    layers: z.array(Layer)
  })
);
export type LayerListing = z.infer<typeof LayerListing>;

export const LayerAsURL = z.object({
  url: z.string().url(),
  metadata: z.record(z.string(), z.union([z.string(), z.number()]))
});
export type LayerAsURL = z.infer<typeof LayerAsURL>;

const API_ROUTE = `/api/layers`;

export class Layers extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  // returns pagination listing
  get(queryProps?: QueryLayerProps) {
    return get<QueryLayerProps, LayerListing>(this.context, queryProps);
  }

  // returns single layer based on query
  getLayer(queryProps?: QueryLayerProps) {
    return request<LayerWithFile>(this.context, {
      params: {
        ...queryProps,
        orgId: this.context.auth.orgId
      },
      url: 'layer'
    });
  }

  // returns single layer based on id
  getById(id: string, queryProps?: QueryLayerProps) {
    return request<LayerWithFile>(this.context, {
      params: {
        ...queryProps,
        orgId: this.context.auth.orgId
      },
      url: id
    });
  }

  // returns layer's url and metadata
  getUrl(queryProps: QueryLayerProps) {
    return request<LayerAsURL>(this.context, {
      params: {
        ...queryProps,
        orgId: this.context.auth.orgId,
        resultType: 'url'
      },
      url: 'layer'
    });
  }

  // downloads the layer's file (image or AR file)
  downloadFile(queryProps: QueryLayerProps) {
    return request(this.context, {
      params: {
        ...queryProps,
        orgId: this.context.auth.orgId,
        resultType: 'file'
      },
      url: 'layer'
    });
  }

  // returns the layers-service URL (not files-service URL) for the file (image or AR file)
  getDownloadUrl(queryProps: QueryLayerProps) {
    return getUri(this.context, {
      params: {
        ...queryProps,
        orgId: this.context.auth.orgId,
        resultType: 'file'
      },
      url: 'layer'
    });
  }
}
