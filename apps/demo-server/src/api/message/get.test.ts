import request from 'supertest';

import { getTestApp } from '../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/products', () => {
  it('should return 200 OK', (done) => {
    request(testServer)
      .get(`/api/message`)
      .expect(200)
      .expect('Content-Type', /text/)
      .expect('Hello World!')
      .end(done);
  });
});
