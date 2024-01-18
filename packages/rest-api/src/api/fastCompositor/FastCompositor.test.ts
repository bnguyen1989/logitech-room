import client from '../Common.test.js';

describe('FastCompositor', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.fastCompositor.healthcheck();
      expect(response.status).toEqual(200);
    });
  });
});
