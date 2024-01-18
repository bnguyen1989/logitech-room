import cors from '@koa/cors';
import Koa from 'koa';
import compress from 'koa-compress';
import logger from 'koa-logger';

import { getRouter } from './getRouter.js';

export type AppProps = {
  logging: boolean;
  cors: boolean;
  compress: boolean;
};
export const getApp = (appProps: AppProps) => {
  const app = new Koa();

  if (appProps.logging) app.use(logger());

  if (appProps.cors) app.use(cors());

  if (appProps.compress)
    app.use(
      compress({
        filter() {
          return true;
        }
      })
    );

  const router = getRouter(appProps.logging);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

export const getTestApp = () => {
  return getApp({
    logging: false,
    cors: true,
    compress: false
  });
};
