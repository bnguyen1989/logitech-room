import { configureStore } from '@reduxjs/toolkit';
import { api, authSlice } from '@threekit/redux-store-api';

import { configuratorsSlice } from './index.js';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [configuratorsSlice.name]: configuratorsSlice.reducer
  }
});

export type ConfiguratorState = ReturnType<typeof store.getState>;
export type ConfiguratorDispatch = typeof store.dispatch;
