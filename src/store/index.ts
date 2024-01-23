import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/ui/Ui.slice';
import configuratorReducer from './slices/configurator/Configurator.slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    configurator: configuratorReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;