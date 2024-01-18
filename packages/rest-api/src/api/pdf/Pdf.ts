import type { Attachment } from '../../forms/FormDataHelpers.js';
import { createViaForm } from '../../operators/createViaForm.js';
import { healthcheck } from '../../operators/healthCheck.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

const API_ROUTE = `/api/pdf`;

export type CreatePdfProps = {
  data: object;
  template: Attachment;
};

export class Pdf extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  async create(createProps: CreatePdfProps) {
    return createViaForm<CreatePdfProps, FileList>(this.context, createProps);
  }
}
