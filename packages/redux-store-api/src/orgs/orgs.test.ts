import { Org } from '@threekit/rest-api';

import { api } from '../api.js';
import { store } from '../common.test.js';

describe('Orgs', () => {
  describe('orgsGetById', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.orgsGetById.initiate())
        .unwrap();
      expect(result).toMatchSchema(Org);
    });
  });
});
