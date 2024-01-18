import { get } from '../../operators/get.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export type TranslationResponse = object; // TODO: Define this.

export type QueryTranslationProps = {
  assetId?: string;
};

const API_ROUTE = `/api/translations`;

export class Translations extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  BEN: This route does not exist on the /translations REST API endpoint as of Dec 6, 2023
  healthcheck() {
    return healthcheck(this.context);
  }*/

  get(queryProps?: QueryTranslationProps) {
    return get<QueryTranslationProps, TranslationResponse>(
      this.context,
      queryProps
    );
  }
}
