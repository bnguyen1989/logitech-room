import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';

import type {
  ConfiguratorDispatch,
  ConfiguratorState
} from '../configuratorsSlice/types.js';

export const useConfiguratorDispatch = () =>
  useDispatch<ConfiguratorDispatch>();
export const useConfiguratorSelector: TypedUseSelectorHook<ConfiguratorState> =
  useSelector;
