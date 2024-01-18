import { generateMock } from '@anatine/zod-mock';
import { App, CreateAppProps, UpdateAppProps } from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { store } from '../common.test.js';

const CreateAppPropsMock = CreateAppProps.omit({ orgId: true });

describe('Apps', () => {
  let app1: App;

  describe('appsCreate(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(
          api.endpoints.appsCreate.initiate(generateMock(CreateAppPropsMock))
        )
        .unwrap();
      app1 = result;
      expect(result).toMatchSchema(App);
    });
  });

  describe('appsGet()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.appsGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(App));
    });
  });

  describe('appsGetById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.appsGetById.initiate(app1.id))
        .unwrap();
      expect(result).toMatchSchema(App);
    });
  });

  describe('appsUpdateById(id)', () => {
    it('should return a valid result', async () => {
      const appUpdates = generateMock(UpdateAppProps);
      const result = await store
        .dispatch(
          api.endpoints.appsUpdateById.initiate({
            id: app1.id,
            app: appUpdates
          })
        )
        .unwrap();
      expect(result).toMatchSchema(App);
      expect(result.name).toBe(appUpdates.name);
      expect(result.url).toBe(appUpdates.url);
      expect(result.metadata).toMatchObject(appUpdates.metadata!);
      expect(result.configuration).toMatchObject(appUpdates.configuration!);
    });
  });

  describe('appsDeleteById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.appsDeleteById.initiate(app1.id))
        .unwrap();
      expect(result).toMatchSchema(App);
      expect(result.deletedAt).toBeTruthy();
    });
  });
});
