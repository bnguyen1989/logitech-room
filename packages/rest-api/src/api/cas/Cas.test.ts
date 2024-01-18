import { generateMock } from '@anatine/zod-mock';

import { AssetV2, CreateAssetV2Props } from '../assetsV2/AssetsV2.js';
import client, { WRONG_ID } from '../Common.test.js';
import { CaseHead, CasObject } from './Cas.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });

describe('Cas', () => {
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

  describe('healthcheck()', () => {
    it('it should return a 200 status', async () => {
      const response = await client.cas.healthcheck();
      expect(response.status).toBe(200);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.cas.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid assetId', async () => {
      const response = await client.cas.getById(asset1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(CasObject);
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.cas.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('getManifestedById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.cas.getManifestedById('fail');
      expect(result).toThrow();
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.cas.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('getHeadById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.cas.getHeadById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid assetId', async () => {
      const response = await client.cas.getHeadById(asset1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(CaseHead);
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.cas.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
