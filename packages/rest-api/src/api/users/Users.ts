import { z } from 'zod';

import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const UserRole = EntityMetadata.merge(
  z.object({
    name: z.string(),
    id: z.string().uuid(),
    orgId: z.string().uuid(),
    role: z.string(),
    userId: z.string().uuid(),
    permissions: z.string(),
    noneditable: z.string()
  })
);
export type UserRole = z.infer<typeof UserRole>;

const UserSessionBase = z.object({
  id: z.string().uuid(),
  emails: z.array(z.string()),
  username: z.string(),
  photo: z.string().nullable(),
  createdAt: z.string(),
  disabledAt: z.string(),
  settings: z.object({
    mfa: z
      .object({
        type: z.string(),
        enabled: z.boolean()
      })
      .optional()
  }),
  orgs: z.array(z.string())
});

export const UserSession = UserSessionBase.merge(
  z.object({ roles: z.array(z.string()) })
);
export type UserSession = z.infer<typeof UserSession>;

export const User = UserSessionBase.merge(
  z.object({
    profile: z.record(z.string(), z.string())
  })
);
export type User = z.infer<typeof User>;

export const UserListing = Pagination.merge(
  z.object({
    users: z.array(User)
  })
);
export type UserListing = z.infer<typeof UserListing>;

export type QueryUserProps = any;

const API_ROUTE = `/api/users`;

export class Users extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  getSession() {
    return request<UserSession>(this.context, { url: `session` });
  }

  get(queryProps?: QueryUserProps) {
    return get<QueryUserProps, UserListing>(this.context, queryProps);
  }

  getById(id: string) {
    const userId = z.string().uuid().parse(id);
    return getById<User>(this.context, userId);
  }
}
