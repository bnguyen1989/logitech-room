import { type CaseReducer, createAction } from '@reduxjs/toolkit';
import type { Configuration } from '@threekit/rest-api';

import type { Attribute, Configurator } from '../Configurator.js';
import type { ConfiguratorSliceState } from '../index.js';

export const addProduct = createAction<{
  key: string;
  product: Configurator & { assetId: string };
}>('configurators/add-product');

export const addProductReducer: CaseReducer<
  ConfiguratorSliceState,
  ReturnType<typeof addProduct>
> = (state, { payload }) => {
  const { key, product } = payload;
  const { name, assetId, attributes = [], metadata, rules } = product;

  if (key in state.activeProductConfigurators) return;

  const attributeData = attributes.reduce(
    (
      output: {
        attributes: Record<string, Attribute>;
        configuration: Configuration;
        attributeOrder: string[];
        attributeMap: Record<string, string>;
      },
      attribute
    ) => {
      Object.assign(output.attributes, { [attribute.id]: attribute });
      Object.assign(output.configuration, {
        [attribute.id]: attribute.defaultValue
      });
      if (!(assetId in state.staticProductData)) {
        output.attributeOrder.push(attribute.id);
        Object.assign(output.attributeMap, {
          [attribute.name]: attribute.id
        });
      }
      return output;
    },
    {
      attributes: {},
      configuration: {},
      attributeOrder: [],
      attributeMap: {}
    }
  );

  state.activeProductConfigurators[key] = {
    assetId,
    attributes: attributeData.attributes,
    configuration: attributeData.configuration
  };

  if (assetId in state.staticProductData) return;

  state.staticProductData[assetId] = {
    name,
    metadata,
    rules,
    attributeMap: attributeData.attributeMap,
    attributeOrder: attributeData.attributeOrder
  };
};
