import client from '../Common.test.js';
// import {
//   bhoustonPrivateApiConfig,
//   urlOfUVTexture
// } from '../test/BhoustonApiConfig.test.js';
// import { Images } from './Images.js';

// type ApiType = Images;
// const ApiClass = Images;

describe('Images', () => {
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.images.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('transform()', () => {
    it('resize: 100x100', async () => {
      const response = await client.images.transform({
        sourceUrl:
          'https://preview.threekit.com/api/files/hash/sha256-7374192157f600c92d375f681d108c45ed3bccbf8998d96a033e8ace2595de70',
        width: 100,
        height: 100
      });
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toEqual('image/jpeg');
    });

    it('format: webp', async () => {
      const response = await client.images.transform({
        sourceUrl:
          'https://preview.threekit.com/api/files/hash/sha256-7374192157f600c92d375f681d108c45ed3bccbf8998d96a033e8ace2595de70',
        format: 'webp'
      });
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toEqual('image/webp');
    });

    it('quality: 50', async () => {
      const response = await client.images.transform({
        sourceUrl:
          'https://preview.threekit.com/api/files/hash/sha256-7374192157f600c92d375f681d108c45ed3bccbf8998d96a033e8ace2595de70',
        quality: 50
      });
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toEqual('image/jpeg');
    });
  });
});

// describe('Images', () => {
//   let api: ApiType;
//   beforeAll(() => {
//     api = new ApiClass(bhoustonPrivateApiConfig);
//   });

//   it(`request`, async () => {
//     const url = api.transformUrl({
//       sourceUrl: urlOfUVTexture.replace('https://', ''),
//       width: 100,
//       height: 100,
//       quality: 50,
//       format: 'webp'
//     });

//     expect(url).toBeDefined();
//     expect(url).toBe(
//       'https://preview.threekit.com/api/images/webp/100x100/filters:format(webp):quality(50)/preview.threekit.com/api/files/hash/sha256-7374192157f600c92d375f681d108c45ed3bccbf8998d96a033e8ace2595de70?bearer_token=29583f10-c3a5-4a91-b33e-d1bdfcd8f2ec'
//     );
//   });
// });
