import { type CaseReducer, createAction } from '@reduxjs/toolkit';

import type { ConfiguratorSliceState } from '../index.js';

export const removeProduct = createAction<string>(
  'configurators/remove-product'
);

export const removeProductReducer: CaseReducer<
  ConfiguratorSliceState,
  ReturnType<typeof removeProduct>
> = (state, { payload: key }) => {
  if (key in state.activeProductConfigurators) {
    const configurators = { ...state.activeProductConfigurators };
    delete configurators[key];
    state.activeProductConfigurators = configurators;
  }
};
