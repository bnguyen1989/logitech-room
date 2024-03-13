import { Middleware } from "@reduxjs/toolkit";

export const middleware: Middleware = (store) => (next) => async (action) => {
  const state = store.getState();
  console.log("Middleware state:", state);
  console.log("Middleware triggered:", action);
  return next(action);
};
