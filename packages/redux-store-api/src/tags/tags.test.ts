import { generateMock } from '@anatine/zod-mock';
import { CreateTagProps, Tag } from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { store } from '../common.test.js';

export const CreateTagPropsMock = CreateTagProps.omit({ orgId: true });

describe('Tags', () => {
  let tag1: Tag;

  describe('tagsCreate()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(
          api.endpoints.tagsCreate.initiate(generateMock(CreateTagPropsMock))
        )
        .unwrap();
      tag1 = result;
      expect(result).toMatchSchema(Tag);
    });
  });

  describe('tagsGet()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.tagsGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(Tag));
    });
  });

  describe('tagsGetById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.tagsGetById.initiate(tag1.id))
        .unwrap();
      expect(result).toMatchSchema(Tag);
    });
  });
});
