import request from 'supertest';

import { getTestApp } from '../../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/glb/optimize', () => {
  it('simple optimize', (done) => {
    const sourceUrl =
      'https://preview.threekit.com/api/files/b656cac3-235f-4632-830e-c42e667ec3a3/content?bearer_token=ea6a7e81-1093-4751-89ef-e0b34164dd97';
    request(testServer)
      .get(`/api/glb/optimize?sourceUrl=${encodeURIComponent(sourceUrl)}`)
      .expect(200)
      .end(done);
  }, 30000);

  it('simplify + simplifyError', (done) => {
    const sourceUrl =
      'https://preview.threekit.com/api/files/b656cac3-235f-4632-830e-c42e667ec3a3/content?bearer_token=ea6a7e81-1093-4751-89ef-e0b34164dd97';
    request(testServer)
      .get(
        `/api/glb/optimize?sourceUrl=${encodeURIComponent(
          sourceUrl
        )}&simplify=false&simplifyError=0.000005`
      )
      .expect(200)
      .end(done);
  }, 30000);

  it('cache scope + cacheMaxAge', (done) => {
    const sourceUrl =
      'https://preview.threekit.com/api/files/b656cac3-235f-4632-830e-c42e667ec3a3/content?bearer_token=ea6a7e81-1093-4751-89ef-e0b34164dd97';
    request(testServer)
      .get(
        `/api/glb/optimize?sourceUrl=${encodeURIComponent(
          sourceUrl
        )}&cacheScope=v1&cacheMaxAge=31536000`
      )
      .expect(200)
      .end(done);
  }, 30000);

  it('dedup + prune', (done) => {
    const sourceUrl =
      'https://preview.threekit.com/api/files/b656cac3-235f-4632-830e-c42e667ec3a3/content?bearer_token=ea6a7e81-1093-4751-89ef-e0b34164dd97';
    request(testServer)
      .get(
        `/api/glb/optimize?sourceUrl=${encodeURIComponent(
          sourceUrl
        )}&dedup=false&prune=false`
      )
      .expect(200)
      .end(done);
  }, 30000);
});
