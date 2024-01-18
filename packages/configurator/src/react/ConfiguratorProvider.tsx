import { configureStore } from '@reduxjs/toolkit';
import { api, authSlice } from '@threekit/redux-store-api';
import type { ThreekitAuthProps } from '@threekit/rest-api';
import { Provider } from 'react-redux';

import { configuratorsSlice } from '../configuratorsSlice/index.js';

interface ConfiguratorProviderProps {
  auth: ThreekitAuthProps;
  children: React.ReactNode;
}

export const createStore = (auth: ThreekitAuthProps) => {
  return configureStore({
    preloadedState: { auth },
    reducer: {
      [api.reducerPath]: api.reducer,
      [authSlice.name]: authSlice.reducer,
      [configuratorsSlice.name]: configuratorsSlice.reducer
    },
    // Amaan: Logger should ideally be brough back. It was causing
    // compile issues in a package consuming this one and it was
    // why. Might have been a version conflict issue?
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat([api.middleware, logger])
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware)
  });
};

export const ConfiguratorProvider = (props: ConfiguratorProviderProps) => {
  const { auth, children } = props;
  return <Provider store={createStore(auth)}>{children}</Provider>;
};
