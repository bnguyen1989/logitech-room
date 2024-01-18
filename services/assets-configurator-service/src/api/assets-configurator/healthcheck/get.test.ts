import request from 'supertest';

import { getTestApp } from '../../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/assets-configurator/healthcheck', () => {
  it('should return 200 OK', (done) => {
    request(testServer)
      .get(`/api/assets-configurator/healthcheck`)
      .expect(200)
      .expect('Content-Type', /text/)
      .expect('OK')
      .end(done);
  });
});
