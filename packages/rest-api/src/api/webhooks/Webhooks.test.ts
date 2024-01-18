import { generateMock } from '@anatine/zod-mock';

import client, { WRONG_ID } from '../Common.test.js';
import {
  CreateWebhookProps,
  Webhook,
  WebhookListing,
  WebhookResponse
} from './Webhooks.js';

const CreateWebhookPropsMock = CreateWebhookProps.omit({ orgId: true });

describe('Webhooks', () => {
  let webhook1: Webhook;

  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.webhooks.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('create(webhook)', () => {
    it('it should return a 422 when creating a Webhook with no address', async () => {
      const newWebhook = generateMock(
        CreateWebhookPropsMock.omit({ address: true })
      );
      //  @ts-ignore
      const response = await client.webhooks.create(newWebhook);
      expect(response.status).toBe(422);
    });

    // it('it should return a 422 when creating a Webhook with no topic', async () => {
    //   const newWebhook = generateMock(
    //     CreateWebhookPropsMock.omit({ topic: true })
    //   );
    //   //  @ts-ignore
    //   const response = await client.webhooks.create(newWebhook);
    //   expect(response.status).toBe(422);
    // });

    it('it should return a valid result when given a valid Webhook', async () => {
      const newWebhook = generateMock(CreateWebhookPropsMock);
      //  @ts-ignore
      const response = await client.webhooks.create(newWebhook);
      webhook1 = response.data.webhook;
      expect(response.data).toMatchSchema(WebhookResponse);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.webhooks.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid webhookId', async () => {
      const response = await client.webhooks.getById(webhook1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(WebhookResponse);
    });

    it('it should return a 404 when given a wrong webhookId', async () => {
      const response = await client.webhooks.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of webhooks', async () => {
      const response = await client.webhooks.get();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(WebhookListing);
    });
  });

  describe('deleteById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.webhooks.deleteById('fail');
      expect(result).toThrow();
    });

    it('it should delete when given a correct webhookId', async () => {
      const response = await client.webhooks.deleteById(webhook1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(WebhookResponse);
      expect(response.data.webhook.deletedAt).toBeTruthy();
    });

    it('it should return a 404 when given a wrong webhookId', async () => {
      const response = await client.webhooks.deleteById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
