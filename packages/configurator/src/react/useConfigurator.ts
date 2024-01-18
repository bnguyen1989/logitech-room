import type { Configuration } from '@threekit/rest-api';
import { useEffect } from 'react';

import { initializeProduct } from '../configuratorsSlice/actions/initializeProduct.js';
import { setProductConfiguration } from '../configuratorsSlice/actions/setConfiguration.js';
import {
  selectAttributes,
  selectConfiguration,
  selectStaticProductDataByKey
} from '../configuratorsSlice/selectors.js';
import { useConfiguratorDispatch, useConfiguratorSelector } from './hooks.js';
export const useConfigurator = (assetId: string, key: string) => {
  const dispatch = useConfiguratorDispatch();
  const productData = useConfiguratorSelector((state) =>
    selectStaticProductDataByKey(state, key)
  );
  const attributes = useConfiguratorSelector((state) =>
    selectAttributes(state, key)
  );
  const configuration = useConfiguratorSelector((state) =>
    selectConfiguration(state, key)
  );

  useEffect(() => {
    dispatch(initializeProduct(assetId, key));
  }, []);

  if (!productData) return null;

  return {
    assetId,
    name: productData.name,
    metadata: productData.metadata,
    attributes,
    configuration,
    setConfiguration: (configuration: Configuration) =>
      dispatch(setProductConfiguration({ key, configuration }))
  };
};
