import { generateMock } from '@anatine/zod-mock';
import {
  AssetV2,
  CreateAssetV2Props,
  DeleteAssetV2Response
} from '@threekit/rest-api';

import { api } from '../api.js';
import { client, store } from '../common.test.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });

describe.skip('AssetsV2', () => {
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

  describe('assetsV2Create(asset)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(
          api.endpoints.assetsV2Create.initiate(
            generateMock(CreateAssetV2PropsMock)
          )
        )
        .unwrap();
      asset1 = result;
      expect(result).toMatchSchema(AssetV2);
    });
  });

  describe('assetV2GetById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.assetsV2GetById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(AssetV2);
    });
  });

  describe('assetV2DeleteById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.assetsV2DeleteById.initiate(asset1.id))
        .unwrap();
      expect(result).toMatchSchema(DeleteAssetV2Response);
    });
  });
});
