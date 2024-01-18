import { generateMock } from '@anatine/zod-mock';
import fsPromises from 'fs/promises';

import { AssetV2, CreateAssetV2Props } from '../assetsV2/AssetsV2.js';
import client, { assetPath, WRONG_ID } from '../Common.test.js';
import {
  CreateSavedConfigurationProps,
  SavedConfiguration,
  SavedConfigurationListing
} from './SavedConfigurations.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });
const CreateSavedConfigurationPropsMock = CreateSavedConfigurationProps.omit({
  productId: true,
  attachments: true
});

const attachmentKey1 = 'Front';
const attachmentKey2 = 'Back';
const filePath = assetPath(`assets/uvTestTexture.jpg`);

describe('SavedConfigurations', () => {
  let asset1: AssetV2;
  let savedConfiguration: SavedConfiguration;

  beforeAll(async () => {
    const newAsset = generateMock(CreateAssetV2PropsMock);
    Object.assign(newAsset, {
      customId: `${newAsset.customId ?? ''}-${Date.now()}`
    });
    const response = await client.assetsV2.create(newAsset);
    asset1 = response.data;
  });

  afterAll(() => client.assetsV2.deleteById(asset1.id));

  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.savedConfigurations.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('create(configuration)', () => {
    it('it should return a 422 when creating a SavedConfiguration with no productId', async () => {
      const newConfiguration = generateMock(CreateSavedConfigurationPropsMock);
      //  @ts-ignore
      const response = await client.savedConfigurations.create(
        newConfiguration
      );
      expect(response.status).toBe(422);
    });

    it('it should return a 422 when creating a SavedConfiguration with no variant', async () => {
      const newConfiguration = generateMock(
        CreateSavedConfigurationPropsMock.omit({ variant: true })
      );
      //  @ts-ignore
      const response = await client.savedConfigurations.create(
        newConfiguration
      );
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when given a valid savedConfiguration', async () => {
      const newConfiguration = generateMock(CreateSavedConfigurationPropsMock);
      const data = await fsPromises.readFile(filePath);
      const data2 = await fsPromises.readFile(filePath);

      const savedConfigurationAttachments = {
        attachments: {
          [attachmentKey1]: 'uvTexture1.jpg',
          [attachmentKey2]: 'uvTexture2.jpg'
        },
        files: [
          new File([data], 'uvTexture1.jpg', {
            type: 'image/jpeg'
          }),
          new File([data2], 'uvTexture2.jpg', {
            type: 'image/jpeg'
          })
        ]
      };

      const response = await client.savedConfigurations.create({
        ...newConfiguration,
        ...savedConfigurationAttachments,
        productId: asset1.id
      });
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(SavedConfiguration);

      savedConfiguration = response.data;
    });
  });

  describe('getFileById()', () => {
    it('retrieve attachment file', async () => {
      const response = await client.savedConfigurations.getFileById(
        savedConfiguration.id,
        attachmentKey1
      );
      expect(response.status).toBe(200);
    });

    it('retrieve non-existent attachment file', async () => {
      const response = await client.savedConfigurations.getFileById(
        savedConfiguration.id,
        'Does not exist'
      );
      expect(response.status).not.toBe(200);
    });
  });

  describe('getById()', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.savedConfigurations.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided as valid configurationId', async () => {
      const response = await client.savedConfigurations.getById(
        savedConfiguration.id
      );
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(SavedConfiguration);
    });

    it('it should return a valid result when provided as valid shortId', async () => {
      const response = await client.savedConfigurations.getById(
        savedConfiguration.shortId
      );
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(SavedConfiguration);
    });

    it('it should return a 404 when given a wrong configurationId', async () => {
      const response = await client.savedConfigurations.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of configurations', async () => {
      const response = await client.savedConfigurations.get();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(SavedConfigurationListing);
    });
  });
});
