import { generateMock } from '@anatine/zod-mock';

import client, { WRONG_ID } from '../Common.test.js';
import { App, AppListing, CreateAppProps, UpdateAppProps } from './Apps.js';

const CreateAppPropsMock = CreateAppProps.omit({ orgId: true });

describe('Apps', () => {
  let app1: App;

  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.apps.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('create(app)', () => {
    it('it should return a 422 when creating an App with no name', async () => {
      const newApp = generateMock(CreateAppPropsMock.omit({ name: true }));
      //  @ts-ignore
      const response = await client.apps.create(newApp);
      expect(response.status).toBe(422);
    });

    it('it should return a 422 when creating an App with no url', async () => {
      const newApp = generateMock(CreateAppPropsMock.omit({ url: true }));
      //  @ts-ignore
      const response = await client.apps.create(newApp);
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when given a valid App', async () => {
      const newApp = generateMock(CreateAppPropsMock);
      //  @ts-ignore
      const response = await client.apps.create(newApp);
      expect(response.status).toBe(200);
      app1 = response.data;
      expect(response.data).toMatchSchema(App);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.apps.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid appId', async () => {
      const response = await client.apps.getById(app1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(App);
    });

    it('it should return a 404 when given a wrong appId', async () => {
      const response = await client.apps.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of apps', async () => {
      const response = await client.apps.get();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(AppListing);
    });
  });

  describe('updateById(id)', () => {
    it('it should return a valid result when provided a valid appId', async () => {
      const appUpdates = generateMock(UpdateAppProps);
      const response = await client.apps.updateById(app1.id, appUpdates);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(App);
      expect(response.data.name).toBe(appUpdates.name);
      expect(response.data.url).toBe(appUpdates.url);
      expect(response.data.metadata).toMatchObject(appUpdates.metadata ?? {});
      expect(response.data.configuration).toMatchObject(
        appUpdates.configuration ?? {}
      );
    });

    it('it should return a 404 when given a wrong appId', async () => {
      const response = await client.apps.updateById(WRONG_ID, {
        name: 'new-name'
      });
      expect(response.status).toBe(404);
    });
  });

  describe('deleteById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.apps.deleteById('fail');
      expect(result).toThrow();
    });

    it('it should delete when given a correct appId', async () => {
      const response = await client.apps.deleteById(app1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(App);
      expect(response.data.deletedAt).toBeTruthy();
    });

    it('it should return a 404 when given a wrong appId', async () => {
      const response = await client.apps.deleteById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
