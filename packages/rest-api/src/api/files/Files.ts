import type { ResponseType } from 'axios';
import { z } from 'zod';

import type { Attachment } from '../../forms/FormDataHelpers.js';
import { createViaForm } from '../../operators/createViaForm.js';
import { getById } from '../../operators/getById.js';
import { getUri } from '../../operators/getUri.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const File = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    filename: z.string(),
    size: z.number(),
    encodings: z.record(z.string(), z.record(z.string(), z.string())),
    hash: z.string(),
    extension: z.string(),
    mimeType: z.string()
  })
);
export type File = z.infer<typeof File>;

export const FileListing = Pagination.merge(
  z.object({
    files: File.array()
  })
);
export type FileListing = z.infer<typeof FileListing>;

export type CreateFileProps = {
  file: Attachment;
};

const API_ROUTE = `/api/files`;

export class Files extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  upload(createProps: CreateFileProps) {
    return createViaForm<CreateFileProps, FileListing>(
      this.context,
      createProps
    );
  }

  getById(id: string) {
    const fileId = z.string().uuid().parse(id);
    return getById<File>(this.context, fileId);
  }

  getDownloadUrlById(id: string) {
    const fileId = z.string().uuid().parse(id);
    return getUri(this.context, {
      url: `${fileId}/content`
    });
  }
  downloadById(
    id: string,
    responseType: ResponseType = typeof window === 'undefined'
      ? 'stream'
      : 'blob'
  ) {
    const fileId = z.string().uuid().parse(id);
    return request(this.context, {
      url: `${fileId}/content`,
      responseType
    });
  }

  /* 
  These are dangerous as the file may not be available yet in compressed form, or it may have a -gz postfix which is hard to predict

  getDownloadUrlByHash(fileHash: string) {
    return this.context.getUri({
      url: `hash/${fileHash}`
    });
  }

  downloadByHash(
    fileHash: string,
    responseType: ResponseType = isNodeEnvironment ? 'stream' : 'blob'
  ) {
    return this.context.request({
      url: `hash/${fileHash}`,
      responseType
    });
  }
  */

  // BEN on Dec 5 2023: This API is very slow to response, it always timed out for me.
  // report() {
  //   return this.context.get<>(`${FILES_API_ROUTE}/report`);
  // }
}
