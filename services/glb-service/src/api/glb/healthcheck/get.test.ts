import request from 'supertest';

import { getTestApp } from '../../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/glb', () => {
  it('should return 200 OK', (done) => {
    request(testServer)
      .get(`/api/glb/healthcheck`)
      .expect(200)
      .expect('Content-Type', /text/)
      .expect('true')
      .end(done);
  });
});
