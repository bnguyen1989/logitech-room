import { generateMock } from '@anatine/zod-mock';
import path from 'path';
import { z } from 'zod';

import { ThreekitClient } from '../ThreekitClient.js';

export const WRONG_ID = generateMock(z.string().uuid());
export const ORG_ID = 'f8b07671-7e71-40a4-b595-c8c54d9e95fd';
export const HOST = 'preview.threekit.com';
export const APP_ID = '581ec46d-e546-4902-80a6-7201756468c7';
export const ASSET_ID = '475c3381-3e31-46c9-8690-8e211a515d00';
export const CONFIGURATION_ID = 'f9741bd3-e6f6-40b3-8f21-888a67399bf4';
export const CONFIGURATION_SHORT_ID = 'uR5pdWewf';
export const DATATABLE_ID = 'dbd06425-2033-4526-a17e-ae670a6acc69';
export const ORDER_ID = '59fcbdc3-9c53-4554-a2b8-342687d755c5';
export const PRICEBOOK_ID = 'e8dcd085-09e4-4bdf-b606-2486ea943b6a';
export const TAG_ID = '786ce3ae-2496-4ee4-9eb6-edda79eb990e';
export const TRANSLATIONS_LOCALE = 'TE';
export const WEBHOOK_ID = '3782b9e4-50dd-40d9-8f28-c3ffc297b0f7';
export const FILE_ID = '1eadf7e1-7440-41a7-b34a-fc5eb1da7763';
export const FILE_HASH =
  'sha256-48ae2a33c4eb6c6b922b300115e83fbd8e4da9a2f5e37d21cf5e7b0809f5a85b';
export const USER_ID = 'd2e5ceee-b140-4b36-9b9c-11bbacedf9a0';
export const LAYER_ID = '7b8d9152-8bb3-49f8-8242-f84cc829e83e';

export const threekitConfig = {
  orgId: ORG_ID as string,
  host: HOST as string,
  privateToken: process.env.TEST_PRIVATE_TOKEN as string
  // publicToken: process.env.TEST_PUBLIC_TOKEN as string
};
const client = new ThreekitClient(threekitConfig);

export default client;

export const assetPath = (relativeFilePath: string): string => {
  const currentFileUrl = import.meta.url;
  const currentDir = path.dirname(currentFileUrl.replace('file://', ''));
  const combinedfilePath = path.join(currentDir, '../..', relativeFilePath);

  return combinedfilePath;
};

test('threekitConfig', () => {
  expect(threekitConfig).toBeDefined();
  expect(threekitConfig.orgId).toBeDefined();
  expect(threekitConfig.host).toBeDefined();
  expect(threekitConfig.privateToken).toBeDefined();
});
