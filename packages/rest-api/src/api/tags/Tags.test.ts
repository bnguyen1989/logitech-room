import { generateMock } from '@anatine/zod-mock';

import client, { WRONG_ID } from '../Common.test.js';
import { CreateTagProps, DeletedTag, Tag, TagListing } from './Tags.js';

export const CreateTagPropsMock = CreateTagProps.omit({ orgId: true });

describe('Tags', () => {
  let tag1: Tag;

  /*
  BEN: This route does not exist on the /tags REST API endpoint as of Dec 6, 2023
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await request.tags.healthcheck();
      expect(response.status).toEqual(200);
    });
  });*/

  describe('create(tag)', () => {
    it('it should return a 422 when creating a Tag with no name', async () => {
      const newTag = generateMock(CreateTagPropsMock.omit({ name: true }));
      //  @ts-ignore
      const response = await client.tags.create(newTag);
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when given a valid Webhook', async () => {
      const newTag = generateMock(CreateTagPropsMock);
      const response = await client.tags.create(newTag);
      tag1 = response.data;
      expect(response.data).toMatchSchema(Tag);
    });
  });

  describe('getById()', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.tags.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid tagId', async () => {
      const response = await client.tags.getById(tag1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Tag);
    });

    it('it should return a 404 when given a wrong tagId', async () => {
      const response = await client.tags.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of tags', async () => {
      const response = await client.tags.get();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(TagListing);
    });
  });

  describe('deleteById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.tags.deleteById('fail');
      expect(result).toThrow();
    });

    it('it should delete when given a correct tagId', async () => {
      const response1 = await client.tags.deleteById(tag1.id);
      expect(response1.status).toBe(200);
      expect(response1.data).toMatchSchema(DeletedTag);

      const response2 = await client.tags.getById(tag1.id);
      expect(response2.status).toBe(200);
      expect(response2.data.deletedAt).toBeTruthy();
    });

    it('it should return a 404 when given a wrong tagId', async () => {
      const response = await client.tags.deleteById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('restoreById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.tags.restoreById('fail');
      expect(result).toThrow();
    });

    it('it should delete when given a correct tagId', async () => {
      const response = await client.tags.restoreById(tag1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Tag);
      expect(response.data.deletedAt).toBeFalsy();
    });

    it('it should return a 404 when given a wrong tagId', async () => {
      const response = await client.tags.restoreById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
