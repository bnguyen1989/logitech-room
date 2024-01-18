import { User, UserSession } from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { store, USER_ID } from '../common.test.js';

describe.skip('Users', () => {
  describe('usersGet()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.usersGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(User));
    });
  });

  describe('usersGetById(id)', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.usersGetById.initiate(USER_ID))
        .unwrap();
      expect(result).toMatchSchema(User);
    });
  });

  describe('usersGetSession()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.usersGetSession.initiate())
        .unwrap();
      expect(result).toMatchSchema(UserSession);
    });
  });
});
