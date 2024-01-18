import { api } from '@threekit/redux-store-api';

import type { ConfiguratorDispatch } from '../types.js';
import { setLocale } from './setLocale.js';

export const fetchTranslations =
  (locale?: string) => async (dispatch: ConfiguratorDispatch) => {
    if (!locale) return;
    await dispatch(
      api.endpoints.translationsGetByLocale.initiate(locale)
    ).unwrap();
    dispatch(setLocale(locale));
  };
