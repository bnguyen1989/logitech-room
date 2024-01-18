import { Storage } from '@google-cloud/storage';
import Koa from 'koa';

export type FileResult = {
  fileName: string;
  mimeType: string;
  fileContent: Buffer;
  lastModified: Date;
};

export const bucketCache = async (
  storage: Storage,
  bucket: string,
  fileName: string,
  mimeType: string,
  ctx: Koa.Context,
  generator: (ctx: Koa.Context) => Promise<Buffer>
): Promise<FileResult> => {
  const file = storage.bucket(bucket).file(fileName);
  let isFile;
  let isGCP; // allow this to run if GCP can not be accessed (e.g. in unit tests)
  try {
    const [fileExists] = await file.exists();
    isFile = fileExists;
    isGCP = true;
  } catch (err) {
    isFile = false;
    isGCP = false;
  }

  let fileContent;
  let lastModified = new Date();
  if (!isFile) {
    const newFileContent = await generator(ctx);
    if (isGCP) {
      file.save(newFileContent, { contentType: mimeType });
    }
    lastModified = new Date();
    fileContent = newFileContent;
  } else {
    const downloadPromise = file.download();
    const metadataPromise = file.getMetadata();

    const [[storedFileContent], [metadata]] = await Promise.all([
      downloadPromise,
      metadataPromise
    ]);
    if (metadata.timeCreated) {
      lastModified = new Date(metadata.timeCreated);
    }
    fileContent = storedFileContent;
  }

  return {
    fileContent,
    lastModified,
    fileName,
    mimeType
  };
};
