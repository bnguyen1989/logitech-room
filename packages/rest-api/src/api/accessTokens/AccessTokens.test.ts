import client, { threekitConfig } from '../Common.test.js';
describe('Accesstokens', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.accesstokens.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  it('get()', async () => {
    // read json
    const response = await client.accesstokens.get({});
    expect(response.status).toBe(200);
    const accessTokenListing = response.data;
    expect(accessTokenListing).toBeDefined();
    expect(accessTokenListing.accesstokens).toBeDefined();
    expect(accessTokenListing.accesstokens.length).toBeGreaterThan(0);
  });

  it('getById()', async () => {
    const response = await client.accesstokens.getById(
      threekitConfig.privateToken
    );
    expect(response.status).toBe(200);
    const accessToken = response.data;
    expect(accessToken).toBeDefined();
    expect(accessToken.id).toBe(threekitConfig.privateToken);
  });
});
