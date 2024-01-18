import type { ResponseType } from 'axios';
import { z } from 'zod';

import type { Attachment } from '../../forms/FormDataHelpers.js';
import { createViaForm } from '../../operators/createViaForm.js';
import { deleteById } from '../../operators/deleteById.js';
import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { request } from '../../operators/request.js';
import { restoreById } from '../../operators/restoreById.js';
import { updateById } from '../../operators/updateById.js';
import { Caching, EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const DatatableColumn = z.object({
  name: z.string(),
  type: z.enum(['String', 'Number'])
});
export type DatatableColumn = z.infer<typeof DatatableColumn>;

export const Datatable = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    orgId: z.string().uuid(),
    name: z.string(),
    version: z.number(),
    delimiter: z.string().optional().nullable(),
    columnInfo: z.array(DatatableColumn)
  })
);
export type Datatable = z.infer<typeof Datatable>;

export const DatatableListing = Pagination.merge(
  z.object({
    datatables: Datatable.omit({ columnInfo: true })
      .merge(z.object({ columnInfo: z.string().uuid() }))
      .array()
  })
);
export type DatatableListing = z.infer<typeof DatatableListing>;

export const DatatableRow = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  tableId: z.string().uuid(),
  version: z.number(),
  createdAt: z.string().optional(),
  value: z.record(z.string(), z.union([z.string(), z.number()]))
});
export type DatatableRow = z.infer<typeof DatatableRow>;

export const DatatableRowListing = Pagination.merge(
  z.object({
    rows: DatatableRow.array()
  })
);
export type DatatableRowListing = z.infer<typeof DatatableRowListing>;

export const CreateDatatableProps = Datatable.pick({
  name: true,
  version: true,
  delimiter: true,
  columnInfo: true
});
export type CreateDatatableProps = z.infer<typeof CreateDatatableProps> & {
  file: Attachment;
};
export type UpdateDatatableProps = object; // TODO: Define this.

const API_ROUTE = `/api/datatables`;

export class Datatables extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  BEN: This route does not exist on the /datatables REST API endpoint as of Dec 6, 2023
  healthcheck() {
    return healthcheck(this.context);
  }*/

  create(createProps: CreateDatatableProps) {
    return createViaForm<CreateDatatableProps, Datatable>(
      this.context,
      createProps
    );
  }

  deleteById(id: string) {
    const datatableId = z.string().uuid().parse(id);
    return deleteById(this.context, datatableId);
  }

  // TODO: Support streams on Node.JS to ensure low memory usage
  downloadCsvById(
    id: string,
    responseType: ResponseType = typeof window === 'undefined'
      ? 'stream'
      : 'blob'
  ) {
    const datatableId = z.string().uuid().parse(id);
    return request(this.context, {
      url: `${datatableId}/download`,
      responseType
    });
  }

  get(queryProps?: object) {
    return get<object, DatatableListing>(this.context, queryProps);
  }

  getById(id: string, caching: Caching = {}) {
    const datatableId = z.string().uuid().parse(id);
    return getById<Datatable>(this.context, datatableId, caching);
  }

  getRowsById(id: string, caching: Caching = {}) {
    const datatableId = z.string().uuid().parse(id);
    console.warn('I think this is just plain wrong'); // TODO: copy from LV-API project
    return request<DatatableRowListing>(this.context, {
      url: `${datatableId}/rows`,
      params: caching
    });
  }

  getRowById(id: string, caching: Caching = {}) {
    const datatableId = z.string().uuid().parse(id);
    console.warn('I think this is just plain wrong'); // TODO: copy from LV-API project
    return request<DatatableRowListing>(this.context, {
      url: `${datatableId}/row`,
      params: caching
    });
  }

  restoreById = (id: string) => {
    const datatableId = z.string().uuid().parse(id);
    return restoreById(this.context, datatableId);
  };

  updateById(id: string, updateProps: UpdateDatatableProps) {
    const datatableId = z.string().uuid().parse(id);
    return updateById<UpdateDatatableProps, Datatable>(
      this.context,
      datatableId,
      updateProps
    );
  }
}
