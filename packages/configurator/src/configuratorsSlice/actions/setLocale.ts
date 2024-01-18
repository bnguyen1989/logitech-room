import { type CaseReducer, createAction } from '@reduxjs/toolkit';

import type { ConfiguratorSliceState } from '../index.js';

export const setLocale = createAction<string>('configurators/set-translations');

export const setLocaleReducer: CaseReducer<
  ConfiguratorSliceState,
  ReturnType<typeof setLocale>
> = (state, { payload: locale }) => {
  state.locale = locale;
};
