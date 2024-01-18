import client from '../Common.test.js';

describe('AssetJobs', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.assetJobs.healthcheck();
      expect(response.status).toEqual(200);
    });
  });
});
