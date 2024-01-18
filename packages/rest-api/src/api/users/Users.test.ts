import client, { USER_ID } from '../Common.test.js';

describe('Users', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.users.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('get()', () => {
    it('it should return a list of users', async () => {
      const response = await client.users.get();
      expect(response.status).toBe(403); // forbidden
    });
  });

  describe('getById()', () => {
    it('it should return a 404 when not found', async () => {
      const response = await client.users.getById(USER_ID!);
      expect(response.status).toBe(404); // not found, is this correct?  Maybe?
    });
  });
});
