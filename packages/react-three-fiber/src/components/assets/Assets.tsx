import { useEffect, useState } from 'react';
import {
  type GLTF,
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import { dracoLoader, ktx2Loader } from '../../utilities/loaders.js';
import { type AssetProps } from '../hooks/useAsset.js';
import { useThreekitAuth } from '../hooks/useThreekitAuth.js';
import { useResolver } from '../resolvers/Resolver.js';

enum LoadingState {
  Loading,
  Loaded,
  Cancelling,
  Cancelled
}

export const Asset = (props: AssetProps) => {
  const { assetId, configuration, ...r3fProps } = props;

  const auth = useThreekitAuth();
  const resolver = useResolver();
  const [glTF, setGLTF] = useState<GLTF | undefined>(undefined);

  useEffect(() => {
    let loadingState = LoadingState.Loading;

    resolver({
      assetId,
      configuration,
      auth
    })
      .then((glTFUrl) => {
        if (loadingState === LoadingState.Loading) {
          const glTFLoader = new GLTFLoader();
          glTFLoader.setDRACOLoader(dracoLoader);
          glTFLoader.setKTX2Loader(ktx2Loader);
          return glTFLoader.loadAsync(glTFUrl);
        } else {
          return undefined;
        }
      })
      .then((gltf) => {
        if (loadingState === LoadingState.Loading) {
          setGLTF(gltf);
          loadingState = LoadingState.Loaded;
        } else {
          loadingState = LoadingState.Cancelled;
        }
        return gltf;
      });
    return () => {
      if (loadingState === LoadingState.Loading) {
        loadingState = LoadingState.Cancelling;
        //console.log('cancelling');
      }
    };
  }, [auth, resolver, assetId, configuration]);

  return <>{glTF ? <primitive object={glTF.scene} {...r3fProps} /> : null}</>;
};
