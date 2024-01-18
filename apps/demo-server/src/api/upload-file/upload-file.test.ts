import request from 'supertest';

import { getTestApp } from '../../app.js';

const testServer = getTestApp().listen();

afterAll(async () => {
  testServer.close();
});

describe('GET /api/upload-file', () => {
  it('should return 200 OK', (done) => {
    // use request to test a file upload to /api/glb/upload
    request(testServer)
      .post('/api/upload-file')
      .attach('files', './assets/uvTestTexture.jpg')
      .expect(201)
      .end(done);
  }, 30000);
});
