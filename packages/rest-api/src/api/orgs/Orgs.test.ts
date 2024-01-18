import { WRONG_ID } from '../Common.test.js';
import client from '../Common.test.js';
import { Org, OrgListing } from './Orgs.js';

describe('Orgs', () => {
  /*
  BEN: This route does not exist on the /orgs REST API endpoint as of Dec 6, 2023
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await request.orgs.healthcheck();
      expect(response.status).toEqual(200);
    });
  });*/

  describe('get()', () => {
    it('it should return a list of orgs', async () => {
      const response = await client.orgs.get();
      expect(response.status).toBe(200);
      const orgListing = response.data;
      expect(orgListing).toMatchSchema(OrgListing);
      expect(orgListing.orgs).toBeDefined();
      expect(orgListing.orgs.length).toBeGreaterThan(0);
    });
  });

  describe('getById()', () => {
    it('it should return a valid result when no orgId is provided', async () => {
      const response = await client.orgs.getById();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Org);
    });

    it('it should return a valid result when provided a valid orgId', async () => {
      const response = await client.orgs.getById(client.auth.orgId);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Org);
    });

    it('it should return a 404 when given a wrong orgId', async () => {
      const response = await client.orgs.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
