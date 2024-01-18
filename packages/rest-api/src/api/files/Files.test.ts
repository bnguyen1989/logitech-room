import fsPromises from 'fs/promises';
import { z } from 'zod';

import { Attachment } from '../../forms/FormDataHelpers.js';
import client, { assetPath } from '../Common.test.js';
import { File, FileListing } from './Files.js';

const filePath = assetPath(`assets/uvTestTexture.jpg`);

describe('Files', () => {
  let file1: FileListing;

  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.images.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('upload() - File', () => {
    it('should return a valid response when given a File', async () => {
      const data = await fsPromises.readFile(filePath);
      const response = await client.files.upload({
        file: new Attachment([data], 'uvTexture.jpg', {
          type: 'image/jpeg'
        })
      });
      file1 = response.data;
      expect(response.status).toEqual(201); // 201 = "Created"
      expect(response.data).toMatchSchema(FileListing);
    });
  });

  describe('getDownloadUrlById(id)', () => {
    it('it should return the url to file when given valid fileId', async () => {
      const url = client.files.getDownloadUrlById(file1.files[0].id);
      expect(url).toMatchSchema(z.string().url());
    });
  });

  describe('downloadById(id)', () => {
    it('it should return a downloadable file when given a valid id', async () => {
      const response = await client.files.downloadById(
        file1.files[0].id,
        'arraybuffer'
      );
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toMatch('image/jpeg');
      const stream = response.data as Buffer;
      expect(stream.length).toBeGreaterThan(0);
    });
  });

  describe('getById(id)', () => {
    it('it should get a file listing that by id', async () => {
      const response = await client.files.getById(file1.files[0].id);
      expect(response.status).toEqual(200);
      expect(response.data).toMatchSchema(File);
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
