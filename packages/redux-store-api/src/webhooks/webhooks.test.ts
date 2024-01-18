import { Webhook } from '@threekit/rest-api';
import { z } from 'zod';

import { api } from '../api.js';
import { store } from '../common.test.js';

describe('Webhooks', () => {
  describe('appsGet()', () => {
    it('should return a valid result', async () => {
      const result = await store
        .dispatch(api.endpoints.webhooksGet.initiate())
        .unwrap();
      expect(result).toMatchSchema(z.array(Webhook));
    });
  });
});
