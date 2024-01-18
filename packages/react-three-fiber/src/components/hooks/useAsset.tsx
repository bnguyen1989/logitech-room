import type { Object3DProps } from '@react-three/fiber';
import type { Configuration } from '@threekit/rest-api';
import { suspend } from 'suspend-react';
import {
  type GLTF,
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import { dracoLoader, ktx2Loader } from '../../utilities/loaders.js';
import { useResolver } from '../resolvers/Resolver.js';
import { useThreekitAuth } from './useThreekitAuth.js';

type BaseAssetProps = {
  assetId: string;
  configuration?: Configuration;
};
export type AssetProps = BaseAssetProps &
  Omit<Object3DProps, keyof BaseAssetProps>;

export const useAsset = ({ assetId, configuration }: AssetProps): GLTF => {
  return suspend(async () => {
    // This is not a standard callback, but rather within the rendering workflow, so calling hooks is allows!

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = useThreekitAuth();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const resolver = useResolver();
    const glTFUrl = await resolver({
      assetId,
      configuration,
      auth
    });
    const glTFLoader = new GLTFLoader();
    glTFLoader.setDRACOLoader(dracoLoader);
    glTFLoader.setKTX2Loader(ktx2Loader);
    return await glTFLoader.loadAsync(glTFUrl);
  }, [assetId, configuration]);
};

/*
useAsset.preLoad = async ({ id, config }: AssetProps) => {
  const auth = useThreekitAuth();
  const resolver = useThreekitResolver();
  const glTFUrl = await resolver({
    id,
    config,
    auth
  });

  return useGLTF.preload(glTFUrl);
};*/
