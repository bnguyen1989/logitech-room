import { z } from 'zod';

import { create } from '../../operators/create.js';
import { deleteById } from '../../operators/deleteById.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { updateById } from '../../operators/updateById.js';
import {
  Configuration,
  EntityMetadata,
  Metadata,
  Pagination
} from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

const AppBase = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  url: z.string().url(),
  configuration: Configuration.nullable(),
  metadata: Metadata.nullable()
});

export const App = EntityMetadata.merge(AppBase);
export type App = z.infer<typeof App>;

export const AppListing = Pagination.merge(
  z.object({
    apps: z.array(App)
  })
);
export type AppListing = z.infer<typeof AppListing>;

export const CreateAppProps = AppBase.pick({
  orgId: true,
  name: true,
  url: true,
  configuration: true,
  metadata: true
}).partial({
  orgId: true,
  configuration: true,
  metadata: true
});
export type CreateAppProps = z.infer<typeof CreateAppProps>;

export const UpdateAppProps = AppBase.pick({
  name: true,
  url: true,
  configuration: true,
  metadata: true
}).partial();
export type UpdateAppProps = z.infer<typeof UpdateAppProps>;

const API_ROUTE = `/api/apps`;
export class Apps extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  create(createProps: CreateAppProps) {
    return create<CreateAppProps, App>(this.context, {
      orgId: this.context.auth.orgId,
      ...createProps
    });
  }

  deleteById(id: string) {
    const appId = z.string().uuid().parse(id);
    return deleteById<App>(this.context, appId);
  }

  get(queryProps?: object) {
    return get<object, AppListing>(this.context, queryProps);
  }

  getById(id: string) {
    const appId = z.string().uuid().parse(id);
    return getById<App>(this.context, appId);
  }

  updateById(id: string, updateProps: UpdateAppProps) {
    const appId = z.string().uuid().parse(id);
    const appUpdate = UpdateAppProps.parse(updateProps);
    return updateById<UpdateAppProps, App>(this.context, appId, appUpdate);
  }
}
