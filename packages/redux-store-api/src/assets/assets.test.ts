import { generateMock } from '@anatine/zod-mock';
import {
  Asset,
  AssetV2,
  CreateAssetV2Props,
  LocaleTranslations
} from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { client, store, TRANSLATIONS_LOCALE } from '../common.test.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });

describe('Assets', () => {
  let asset1: AssetV2;

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
  });

  afterAll(async () => {
    const deleteAssetPromises = [asset1].map((assetV2) =>
      client.assetsV2.deleteById(assetV2.id)
    );
    return Promise.all(deleteAssetPromises);
  });

  describe('assetGet()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.assetsGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(Asset));
    });
  });

  describe('appsGetById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.assetsGetById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(Asset);
    });
  });

  describe('translationsGetByLocale(local)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(
          api.endpoints.translationsGetByLocale.initiate(TRANSLATIONS_LOCALE)
        )
        .unwrap();
      expect(result).toMatchSchema(LocaleTranslations);
    });
  });
});
