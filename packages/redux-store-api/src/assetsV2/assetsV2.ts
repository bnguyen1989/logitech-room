import { AssetsV2, AssetV2, CreateAssetV2Props } from '@threekit/rest-api';

import type { RestApiEndpointBuilder } from '../api.js';
import { TAGS } from '../constants.js';
export const assetsV2Endpoints = (build: RestApiEndpointBuilder) => ({
  assetsV2GetById: build.query<AssetV2, string>({
    query: (id) => (auth) => new AssetsV2(auth).getById(id),
    providesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  }),
  assetsV2Create: build.mutation<AssetV2, CreateAssetV2Props>({
    query: (asset) => (auth) => new AssetsV2(auth).create(asset),
    invalidatesTags: (asset) =>
      asset ? [{ type: TAGS.ASSETS, id: asset.id }] : []
  }),
  assetsV2DeleteById: build.mutation<AssetV2, string>({
    query: (id) => (auth) => new AssetsV2(auth).deleteById(id),
    invalidatesTags: (_r, _e, id) => [{ type: TAGS.ASSETS, id }]
  })
});
