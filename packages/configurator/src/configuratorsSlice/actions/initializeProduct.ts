import { api } from '@threekit/redux-store-api';
import type { Asset } from '@threekit/rest-api';

import { CasAttribute } from '../../cas/configurator/attributes.js';
import { ATTRIBUTE_TYPE } from '../../cas/constants.js';
import { unpackAsset, unpackAttribute } from '../../cas/index.js';
import type { Attribute } from '../Configurator.js';
import type { ConfiguratorDispatch } from '../types.js';
import { addProduct } from './addProduct.js';

export const initializeProduct =
  (assetId: string, key?: string) => async (dispatch: ConfiguratorDispatch) => {
    const assetCas = await dispatch(
      api.endpoints.casGetById.initiate(assetId)
    ).unwrap();
    const asset = unpackAsset(assetCas);

    if (!asset.configurator) return;

    const attributes: Array<Attribute> = [];

    const attributePromises = asset.configurator.attributes.map(
      async (attr) => {
        let incoming: CasAttribute = { ...attr };

        if (attr.type == ATTRIBUTE_TYPE.global) {
          const attributeCas = await dispatch(
            api.endpoints.casGetById.initiate(attr.id)
          ).unwrap();
          incoming = { ...unpackAttribute(attributeCas) };

          incoming.metadata = [incoming.metadata, attr.metadata].flat();
          if (
            (typeof attr.defaultValue === 'object' &&
              attr.defaultValue.assetId?.length) ||
            attr.defaultValue != null
          )
            incoming.defaultValue = attr.defaultValue;
        }

        let attribute: Attribute | undefined;
        const attributeShared = {
          id: incoming.id,
          name: incoming.name,
          visible: true,
          enabled: true,
          metadata: (incoming.metadata ?? []).reduce(
            (output: Record<string, string | number>, property) =>
              property
                ? Object.assign(output, { [property.key]: property.value })
                : output,
            {}
          )
        };

        switch (incoming.type) {
          case ATTRIBUTE_TYPE.number:
            attribute = {
              ...attributeShared,
              type: ATTRIBUTE_TYPE.number,
              defaultValue: incoming.defaultValue,
              min:
                typeof incoming.min === 'string'
                  ? parseInt(incoming.min)
                  : incoming.min,
              max:
                typeof incoming.max === 'string'
                  ? parseInt(incoming.max)
                  : incoming.max,
              step: incoming.step,
              lockToStep: incoming.lockToStep
            };
            break;
          case ATTRIBUTE_TYPE.string:
            attribute = {
              ...attributeShared,
              type: ATTRIBUTE_TYPE.string,
              defaultValue: incoming.defaultValue,
              values: incoming.values.map((val) => ({
                label: val,
                value: val,
                visible: true,
                enabled: true
              }))
            };
            break;
          case ATTRIBUTE_TYPE.boolean:
            attribute = {
              ...attributeShared,
              type: ATTRIBUTE_TYPE.boolean,
              defaultValue: incoming.defaultValue
            };
            break;
          case ATTRIBUTE_TYPE.color:
            attribute = {
              ...attributeShared,
              type: ATTRIBUTE_TYPE.color,
              defaultValue: incoming.defaultValue
            };
            break;
          case ATTRIBUTE_TYPE.asset: {
            const attributeValuePromises = incoming.values.map(
              async (attributeValue) => {
                if (
                  typeof attributeValue === 'string' &&
                  attributeValue.startsWith('#')
                ) {
                  return dispatch(
                    api.endpoints.assetsGet.initiate({
                      legacyTagNames: JSON.stringify([attributeValue])
                    })
                  ).unwrap();
                } else if (typeof attributeValue === 'object') {
                  if ('tagId' in attributeValue) {
                    return dispatch(
                      api.endpoints.assetsGet.initiate({
                        tags: JSON.stringify([attributeValue.tagId])
                      })
                    ).unwrap();
                  } else if ('assetId' in attributeValue) {
                    return dispatch(
                      api.endpoints.assetsGetById.initiate(
                        attributeValue.assetId
                      )
                    ).unwrap();
                  }
                }

                return attributeValue;
              }
            );
            const attributeValues = (await Promise.all(
              attributeValuePromises
            )) as Array<Asset | Asset[]>;
            attribute = {
              ...attributeShared,
              type: ATTRIBUTE_TYPE.asset,
              assetType: incoming.assetType,
              defaultValue: incoming.defaultValue,
              values: attributeValues.flat().map((val) => ({
                assetId: val.id,
                name: val.name,
                fileSize: val.fileSize,
                metadata: val.metadata || {},
                tags: val.tags,
                tagids: val.tagids,
                visible: true,
                enabled: true
              }))
            };
            break;
          }
          default:
            break;
        }
        if (attribute) attributes.push(attribute);
      }
    );
    await Promise.all(attributePromises);

    const defaultProduct = {
      key: key ?? assetId,
      product: {
        assetId,
        name: asset.name,
        metadata: asset.configurator.metadata,
        rules: asset.configurator.rules,
        attributes
      }
    };

    dispatch(addProduct(defaultProduct));

    return defaultProduct;
  };
