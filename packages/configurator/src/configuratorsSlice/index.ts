import { createSlice } from '@reduxjs/toolkit';
import type { Configuration } from '@threekit/rest-api';

import { Metadata } from '../cas/configurator/metadata.js';
import { Rule } from '../cas/configurator/rules.js';
import { addProduct, addProductReducer } from './actions/addProduct.js';
import {
  removeProduct,
  removeProductReducer
} from './actions/removeProduct.js';
import {
  setConfigurationReducer,
  setProductConfiguration
} from './actions/setConfiguration.js';
import { setLocale, setLocaleReducer } from './actions/setLocale.js';
import type { Attribute } from './Configurator.js';

/*****************************************************
 * Types and Interfaces
 ****************************************************/

export interface ConfiguratorSliceState {
  staticProductData: {
    [assetId: string]: {
      name: string;
      metadata: Metadata;
      rules: Rule[];
      attributeOrder: string[];
      attributeMap: Record<string, string>;
    };
  };
  activeProductConfigurators: {
    [key: string]: {
      assetId: string;
      attributes: Record<string, Attribute>;
      configuration: Configuration;
    };
  };
  locale: string | null;
}

/*****************************************************
 * Slice
 ****************************************************/

const initialState: ConfiguratorSliceState = {
  staticProductData: {},
  activeProductConfigurators: {},
  locale: null
};

export const configuratorsSlice = createSlice({
  name: 'configurators',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(setLocale, setLocaleReducer)
      .addCase(addProduct, addProductReducer)
      .addCase(removeProduct, removeProductReducer)
      .addCase(setProductConfiguration, setConfigurationReducer);
  },
  reducers: {}
});
