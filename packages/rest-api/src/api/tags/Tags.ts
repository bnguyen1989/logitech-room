import { z } from 'zod';

import { create } from '../../operators/create.js';
import { deleteById } from '../../operators/deleteById.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { restoreById } from '../../operators/restoreById.js';
import { updateById } from '../../operators/updateById.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

const TagBase = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  legacyName: z.string().nullable(),
  label: z.string().nullable(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  type: z.union([z.literal('catalog'), z.literal('asset')])
});

export const Tag = EntityMetadata.merge(TagBase);
export type Tag = z.infer<typeof Tag>;

export const TagListing = Pagination.merge(
  z.object({
    tags: z.array(Tag)
  })
);
export type TagListing = z.infer<typeof TagListing>;

export type QueryTagProps = object; // TODO: Define this.

export const CreateTagProps = TagBase.pick({
  orgId: true,
  name: true,
  type: true
}).partial({ orgId: true });
export type CreateTagProps = z.infer<typeof CreateTagProps>; // TODO: Define this.

export const UpdateTagProps = z.object({
  tagId: z.string().uuid(),
  tag: TagBase.partial()
});
export type UpdateTagProps = z.infer<typeof UpdateTagProps>;

export const DeletedTag = z.object({ message: z.literal('ok') });
export type DeletedTag = z.infer<typeof DeletedTag>;

const API_ROUTE = `/api/tags`;

export class Tags extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  BEN: This route does not exist on the /tags REST API endpoint as of Dec 6, 2023
  healthcheck() {
    return healthcheck(this.context);
  }*/

  create(createProps: CreateTagProps) {
    return create<CreateTagProps, Tag>(this.context, createProps);
  }

  deleteById(id: string) {
    const tagId = z.string().uuid().parse(id);
    return deleteById<DeletedTag>(this.context, tagId);
  }

  get(queryProps?: QueryTagProps) {
    return get<QueryTagProps, TagListing>(this.context, queryProps);
  }

  getById(id: string) {
    const tagId = z.string().uuid().parse(id);
    return getById<Tag>(this.context, tagId);
  }

  restoreById(id: string) {
    const tagId = z.string().uuid().parse(id);
    return restoreById<Tag>(this.context, tagId);
  }

  updateById(id: string, updateProps: UpdateTagProps) {
    const tagId = z.string().uuid().parse(id);
    return updateById<UpdateTagProps, TagListing>(
      this.context,
      tagId,
      updateProps
    );
  }
}
