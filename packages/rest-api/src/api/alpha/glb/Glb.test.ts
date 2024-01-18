import client from '../../Common.test.js';

describe('Glb', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.alpha.glb.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  const exampleGlb =
    'https://preview.threekit.com/api/files/b656cac3-235f-4632-830e-c42e667ec3a3/content?bearer_token=ea6a7e81-1093-4751-89ef-e0b34164dd97';

  describe('getOptimizeUrl()', () => {
    it('basic', async () => {
      const url = client.alpha.glb.getOptimizeUrl({
        sourceUrl: exampleGlb
      });
      expect(url).toBeDefined();
    });
  });

  describe('optimize()', () => {
    it('basic', async () => {
      const response = await client.alpha.glb.optimize({
        sourceUrl: exampleGlb
      });
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toEqual('model/gltf-binary');
    }, 20000);

    it('advanced', async () => {
      const response = await client.alpha.glb.optimize({
        sourceUrl: exampleGlb,
        dedup: false,
        prune: false,
        instance: false,
        simplify: false
      });
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toEqual('model/gltf-binary');
    }, 20000);
  });
});
