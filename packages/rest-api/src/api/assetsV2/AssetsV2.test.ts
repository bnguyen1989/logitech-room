import { generateMock } from '@anatine/zod-mock';

import client, { WRONG_ID } from '../Common.test.js';
import {
  AssetV2,
  CreateAssetV2Props,
  DeleteAssetV2Response
} from './AssetsV2.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });
describe('AssetsV2', () => {
  let asset1: AssetV2;

  describe('create(assetV2)', () => {
    it('it should return a 422 when creating an Asset with no name', async () => {
      const newAsset = generateMock(
        CreateAssetV2PropsMock.omit({ name: true })
      );
      //  @ts-ignore
      const response = await client.assetsV2.create(newAsset);
      expect(response.status).toBe(422);
    });

    it('it should return a 422 when creating an Asset with no type', async () => {
      const newAsset = generateMock(
        CreateAssetV2PropsMock.omit({ type: true })
      );
      //  @ts-ignore
      const response = await client.apps.create(newAsset);
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when given a valid Asset', async () => {
      const newAsset = generateMock(CreateAssetV2PropsMock);
      Object.assign(newAsset, {
        customId: `${newAsset.customId ?? ''}-${Date.now()}`
      });
      //  @ts-ignore
      const response = await client.assetsV2.create(newAsset);
      expect(response.status).toBe(200);
      asset1 = response.data;
      expect(response.data).toMatchSchema(AssetV2);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.assetsV2.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid assetId', async () => {
      const response = await client.assetsV2.getById(asset1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(AssetV2);
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.assetsV2.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('deleteById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.assetsV2.deleteById('fail');
      expect(result).toThrow();
    });

    it('it should delete when given a correct assetId', async () => {
      const response = await client.assetsV2.deleteById(asset1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(DeleteAssetV2Response);
    });

    it('it should return a 404 when given a wrong assetId', async () => {
      const response = await client.assetsV2.deleteById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
