import request from 'supertest';

import { getTestApp } from '../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/products', () => {
  it('should return 200 OK', (done) => {
    request(testServer).get(`/api/products`).expect(200).end(done);
  });
});
