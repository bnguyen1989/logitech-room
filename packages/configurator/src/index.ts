/*****************************************************
 * Redux Slice
 ****************************************************/

export { initializeProduct } from './configuratorsSlice/actions/initializeProduct.js';
export { removeProduct } from './configuratorsSlice/actions/removeProduct.js';
export { setProductConfiguration } from './configuratorsSlice/actions/setConfiguration.js';
export { setLocale } from './configuratorsSlice/actions/setLocale.js';
export { fetchTranslations } from './configuratorsSlice/actions/fetchTranslations.js';
export {
  selectStaticProductDataByKey,
  selectConfiguration,
  selectAttributes
} from './configuratorsSlice/selectors.js';
export * from './configuratorsSlice/Configurator.js';

/*****************************************************
 * Types
 ****************************************************/

export type {
  ConfiguratorState,
  ConfiguratorDispatch
} from './configuratorsSlice/types.js';

/*****************************************************
 * React
 ****************************************************/

export {
  ConfiguratorProvider,
  createStore
} from './react/ConfiguratorProvider.js';
export { useConfigurator } from './react/useConfigurator.js';
export {
  useConfiguratorDispatch,
  useConfiguratorSelector
} from './react/hooks.js';
