import {
  type BaseQueryApi,
  type BaseQueryFn,
  createApi,
  type EndpointBuilder
} from '@reduxjs/toolkit/query/react';
import type { ThreekitAuthProps } from '@threekit/rest-api';
import type { AxiosResponse } from 'axios';

import { appsEndpoints } from './apps/apps.js';
import { assetsEndpoints } from './assets/assets.js';
import { assetsV2Endpoints } from './assetsV2/assetsV2.js';
import { getAuth } from './auth.js';
import { casEndpoints } from './cas/cas.js';
import { TAGS } from './constants.js';
import * as errors from './errors.js';
import { orgsEndpoints } from './orgs/orgs.js';
import { savedConfigurationsEndpoints } from './savedConfigurations/savedConfigurations.js';
import { tagsEndpoints } from './tags/tags.js';
import { translationsEndpoints } from './translations/translations.js';
import { usersEndpoints } from './users/users.js';
import { webhooksEndpoints } from './webhooks/webhooks.js';

export type RestApiBaseQuery = BaseQueryFn<
  (auth: ThreekitAuthProps) => Promise<AxiosResponse>, // Args
  unknown, // Result
  { status: string | number; data: string; error?: string }, // Error
  { responseField?: string }, // DefinitionExtraOptions
  { timestamp: number } // Meta
>;

export type RestApiEndpointBuilder = EndpointBuilder<
  RestApiBaseQuery,
  TAGS,
  'api'
>;

const restApiBaseQuery: RestApiBaseQuery = async (
  apiFn,
  { getState }: BaseQueryApi
) => {
  try {
    const auth = getAuth(getState() as { auth: ThreekitAuthProps });
    if (!auth || !auth.orgId.length) return errors.authMissing;
    const response = await apiFn(auth);
    if (response.status === 200) return { data: response.data };
    return errors.getResponseError(response);
  } catch (e) {
    return errors.customError;
  }
};

export const api = createApi({
  baseQuery: restApiBaseQuery,
  tagTypes: Object.values(TAGS),
  endpoints: (build) => ({
    ...appsEndpoints(build),
    ...assetsEndpoints(build),
    ...assetsV2Endpoints(build),
    ...casEndpoints(build),
    ...orgsEndpoints(build),
    ...savedConfigurationsEndpoints(build),
    ...tagsEndpoints(build),
    ...translationsEndpoints(build),
    ...usersEndpoints(build),
    ...webhooksEndpoints(build)
  })
});
