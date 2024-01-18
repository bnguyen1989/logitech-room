import client from '../Common.test.js';

describe('Products', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.products.healthcheck();
      expect(response.status).toEqual(200);
    });
  });
});
