import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui/Ui.slice";
import configuratorReducer from "./slices/configurator/Configurator.slice";
import modalsReducer from "./slices/modals/Modals.slice";
import userReducer from "./slices/user/User.slice";
import { middleware } from "./middleware";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    configurator: configuratorReducer,
    modals: modalsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
