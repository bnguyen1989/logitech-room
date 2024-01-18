import type { ResponseType } from 'axios';
import { z } from 'zod';

import type { Attachment } from '../../forms/FormDataHelpers.js';
import { createViaForm } from '../../operators/createViaForm.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import {
  Caching,
  Configuration,
  EntityMetadata,
  Metadata,
  Pagination
} from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const ShortId = z.string().regex(/^[a-zA-Z0-9_-]{7,14}$/);
export type ShortId = z.infer<typeof ShortId>;

export const SavedConfigurationId = z.union([z.string().uuid(), ShortId]);

export const SavedConfiguration = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    shortId: ShortId,
    orgId: z.string().uuid(),
    variant: Configuration.nullable(),
    sceneGraphState: z.string().nullable(),
    customerId: z.string().nullable(),
    identifier: z.string().nullable(),
    metadata: Metadata.nullable(),
    productId: z.string().uuid(),
    productVersion: z.string().nullable(),
    scope: z.string().nullable(),
    thumbnail: z.string().nullable(),
    attachments: z.record(z.string(), z.string())
  })
);
export type SavedConfiguration = z.infer<typeof SavedConfiguration>;

export const SavedConfigurationListing = Pagination.merge(
  z.object({
    configurations: SavedConfiguration.array()
  })
);
export type SavedConfigurationListing = z.infer<
  typeof SavedConfigurationListing
>;

export const CreateSavedConfigurationProps = SavedConfiguration.pick({
  productId: true,
  productVersion: true,
  variant: true,
  sceneGraphState: true,
  metadata: true,
  shortId: true,
  customerId: true,
  attachments: true
}).partial();
export type CreateSavedConfigurationProps = z.infer<
  typeof CreateSavedConfigurationProps
> & {
  files?: Attachment[];
};

export type QuerySavedConfigurationProps = object; // TODO: Define, based on LV-API.

const API_ROUTE = `/api/configurations`;

export class SavedConfigurations extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  create(createProps: CreateSavedConfigurationProps) {
    return createViaForm<CreateSavedConfigurationProps, SavedConfiguration>(
      this.context,
      createProps
    );
  }

  get(queryProps?: QuerySavedConfigurationProps) {
    return get<QuerySavedConfigurationProps, SavedConfigurationListing>(
      this.context,
      queryProps
    );
  }

  getById(idOrShortId: string, caching: Caching = {}) {
    const configurationId = z
      .union([ShortId, z.string().uuid()])
      .parse(idOrShortId);
    return getById<SavedConfiguration>(this.context, configurationId, caching);
  }

  getFileById(
    idOrShortId: string,
    attachmentKey: string,
    responseType: ResponseType = typeof window === 'undefined'
      ? 'stream'
      : 'blob',
    caching: Caching = {}
  ) {
    const configurationId = z
      .union([ShortId, z.string().uuid()])
      .parse(idOrShortId);
    return request<SavedConfiguration>(this.context, {
      url: `${configurationId}/files/${attachmentKey}`,
      responseType,
      params: caching
    });
  }

  getThumbnailById(
    idOrShortId: string,
    responseType: ResponseType = typeof window === 'undefined'
      ? 'stream'
      : 'blob'
  ) {
    const configurationId = z
      .union([ShortId, z.string().uuid()])
      .parse(idOrShortId);
    return request<SavedConfiguration>(this.context, {
      url: `${configurationId}/thumbnail`,
      responseType
    });
  }
}
