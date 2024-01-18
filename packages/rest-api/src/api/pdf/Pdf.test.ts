import client from '../Common.test.js';

describe('Pdf', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.pdf.healthcheck();
      expect(response.status).toEqual(200);
    });
  });
});
