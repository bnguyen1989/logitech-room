import { generateMock } from '@anatine/zod-mock';
import {
  AssetV2,
  CreateAssetV2Props,
  CreateSavedConfigurationProps,
  SavedConfiguration
} from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { client, store } from '../common.test.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });
const CreateSavedConfigurationPropsMock = CreateSavedConfigurationProps.omit({
  productId: true,
  attachments: true
});

describe.skip('SavedConfigurations', () => {
  let asset1: AssetV2;
  let savedConfiguration1: SavedConfiguration;

  beforeAll(async () => {
    const newAssetPromises = [generateMock(CreateAssetV2PropsMock)].map(
      async (assetV2) => {
        Object.assign(assetV2, {
          customId: `${assetV2.customId ?? ''}-${Date.now()}`
        });
        const response = await client.assetsV2.create(assetV2);
        return response.data;
      }
    );
    [asset1] = await Promise.all(newAssetPromises);

    const newSavedConfigurationPromises = [
      generateMock(CreateSavedConfigurationPropsMock)
    ].map(async (savedConfiguration) => {
      const response = await client.savedConfigurations.create({
        ...savedConfiguration,
        productId: asset1.id
      });
      return response.data;
    });
    [savedConfiguration1] = await Promise.all(newSavedConfigurationPromises);
  });

  afterAll(async () => {
    const deleteAssetPromises = [asset1].map((assetV2) =>
      client.assetsV2.deleteById(assetV2.id)
    );
    return Promise.all(deleteAssetPromises);
  });

  describe('getById()', () => {
    it('it should return a valid result when provided a valid configurationId', async () => {
      const result = await store
        .dispatch(
          api.endpoints.savedConfigurationsGetById.initiate(
            savedConfiguration1.id
          )
        )
        .unwrap();
      expect(result).toMatchSchema(SavedConfiguration);
    });
  });

  describe('get()', () => {
    it('it should return a list of configurations', async () => {
      const result = await store
        .dispatch(api.endpoints.savedConfigurationsGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(SavedConfiguration));
    });
  });
});
