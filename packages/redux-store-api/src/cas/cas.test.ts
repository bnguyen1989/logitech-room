import { generateMock } from '@anatine/zod-mock';
import {
  AssetV2,
  CaseHead,
  CasManifested,
  CasObject,
  CreateAssetV2Props
} from '@threekit/rest-api';

import { api } from '../api.js';
import { client, store } from '../common.test.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });

describe.skip('Cas', () => {
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

  describe('casGetById', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.casGetById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(CasObject);
    });
  });
  describe('casGetManifestedById', () => {
    it.skip('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.casGetManifestedById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(CasManifested);
    });
  });
  describe('casGetHeadById', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.casGetHeadById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(CaseHead);
    });
  });
});
