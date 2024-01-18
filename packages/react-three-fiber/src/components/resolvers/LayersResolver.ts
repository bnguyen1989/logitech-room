import { Layers } from '@threekit/rest-api';

import type { GLTFUrlResolverProps } from './GLTFUrlResolver.js';

export const LayersResolver = async ({
  auth,
  assetId,
  configuration
}: GLTFUrlResolverProps): Promise<any> => {
  return await new Layers(auth).getDownloadUrl({
    assetId,
    assetLayerConfiguration: configuration,
    format: 'glb'
  });
};
