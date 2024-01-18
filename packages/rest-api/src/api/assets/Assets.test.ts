import { generateMock } from '@anatine/zod-mock';

import { AssetV2, CreateAssetV2Props } from '../assetsV2/AssetsV2.js';
import client, { TRANSLATIONS_LOCALE, WRONG_ID } from '../Common.test.js';
import { Asset, AssetListing, LocaleTranslations } from './Assets.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });

describe('Assets', () => {
  let asset1: AssetV2;

  describe('healthcheck()', () => {
    it('it should return a 200 status', async () => {
      const response = await client.assets.healthcheck();
      expect(response.status).toBe(200);
    });
  });

  beforeAll(async () => {
    const newAsset = generateMock(CreateAssetV2PropsMock);
    Object.assign(newAsset, {
      customId: `${newAsset.customId ?? ''}-${Date.now()}`
    });
    const response = await client.assetsV2.create(newAsset);
    asset1 = response.data;
  });

  afterAll(() => client.assetsV2.deleteById(asset1.id));

  describe('getById()', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const response = await client.assets.getById('fail');
      expect(response.status).toBe(404);
    });

    it('it should return a valid result when provided a valid assetId', async () => {
      const response = await client.assets.getById(asset1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Asset);
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.assets.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('get all', async () => {
      const response = await client.assets.get();
      expect(response.status).toBe(200);
      const assetListing = response.data;
      expect(assetListing).toMatchSchema(AssetListing);
      expect(assetListing.assets.length).toBeGreaterThan(0);
    });

    it('get via metadata query', async () => {
      const response = await client.assets.get({
        metadata: { Category: 'Alpha' }
      });
      expect(response.status).toBe(200);
      const assetListing = response.data;
      expect(assetListing).toMatchSchema(AssetListing);
      expect(assetListing.assets.length).toBe(1);
    });
  });
  describe('assets.deleteById(id)', () => {
    it('delete', async () => {
      const response = await client.assetsV2.deleteById(asset1.id);
      expect(response.status).toBe(200);
    });
  });
});

describe('assets.getTranslationsForLocale(locale)', () => {
  it('it should return a valid result when provided a valid locale', async () => {
    const response = await client.assets.getTranslationsByLocale(
      TRANSLATIONS_LOCALE!
    );
    expect(response.status).toBe(200);
    expect(response.data).toMatchSchema(LocaleTranslations);
  });

  it('it should return an empty object when given a locale with no translations', async () => {
    const response = await client.assets.getTranslationsByLocale('fail');
    expect(response.status).toBe(200);
    expect(JSON.stringify(response.data)).toBe(JSON.stringify({}));
  });
});
