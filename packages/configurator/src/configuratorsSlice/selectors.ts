import { createSelector } from '@reduxjs/toolkit';
import { api } from '@threekit/redux-store-api';
import type { Configuration, LocaleTranslations } from '@threekit/rest-api';

import { ATTRIBUTE_TYPE } from '../cas/constants.js';
import type { ConfiguratorState } from './types.js';

const selectTranslations = (state: ConfiguratorState): LocaleTranslations => {
  const { locale } = state.configurators;
  if (!locale) return {};
  const translations =
    api.endpoints.translationsGetByLocale.select(locale)(state).data;
  return translations ?? {};
};

const selectAssetIdByKey = (state: ConfiguratorState, key: string) =>
  state.configurators.activeProductConfigurators[key]?.assetId;

const getConfiguratorByKey = (state: ConfiguratorState, key: string) =>
  state.configurators.activeProductConfigurators[key];

const getConfigurationByKey = (state: ConfiguratorState, key: string) =>
  state.configurators.activeProductConfigurators[key]?.configuration;

export const selectStaticProductDataByKey = (
  state: ConfiguratorState,
  key: string
) => {
  const assetId = selectAssetIdByKey(state, key);
  if (!assetId) return null;
  return state.configurators.staticProductData[assetId];
};

const getAttributeNameLookup = createSelector(
  [selectStaticProductDataByKey],
  (productData) =>
    Object.entries(productData?.attributeMap || {}).reduce(
      (output: Record<string, string>, [key, value]) =>
        Object.assign(output, { [value]: key }),
      {}
    )
);

export const selectConfiguration = createSelector(
  [getConfigurationByKey, getAttributeNameLookup],
  (configuration, attributeNameLookup) => {
    if (!configuration) return null;
    const preppedConfiguration = Object.entries(configuration).reduce(
      (output: Configuration, [attributeId, value]) =>
        Object.assign(output, {
          [attributeNameLookup[attributeId]]: value
        }),
      {}
    );
    return preppedConfiguration;
  }
);

export const selectAttributes = createSelector(
  [getConfiguratorByKey, selectStaticProductDataByKey, selectTranslations],
  (configurator, productData, translations) => {
    if (!configurator) return null;
    if (!productData) return null;

    const { attributeOrder } = productData;
    const { attributes, configuration } = configurator;

    return attributeOrder.map((attributeId) => {
      const attribute = { ...attributes[attributeId] };

      attribute.name = translations[attribute.name] ?? attribute.name;
      const attributeValue = configuration[attributeId];

      if (attribute.type === ATTRIBUTE_TYPE.asset) {
        let value;
        const values = attribute.values.map((el) => {
          const selected = !!(
            attributeValue &&
            typeof attributeValue === 'object' &&
            'assetId' in attributeValue &&
            attributeValue.assetId === el.assetId
          );

          const preppedValue = {
            ...el,
            name: translations[el.name] ?? el.name
          };
          if (selected) value = preppedValue;

          return {
            ...preppedValue,
            selected
          };
        });
        return {
          ...attribute,
          values,
          value
        };
      } else if (attribute.type === ATTRIBUTE_TYPE.string) {
        const values = attribute.values.map((el) =>
          Object.assign({
            ...el,
            label: translations[el.label] ?? el.label,
            selected:
              typeof attributeValue === 'string' && el.value === attributeValue
          })
        );

        return {
          ...attribute,
          values,
          value: attributeValue
        };
      }

      return {
        ...attribute,
        value: attributeValue
      };
    });
  }
);
