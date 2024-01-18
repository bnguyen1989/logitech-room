import Router from '@koa/router';
import Koa from 'koa';

import { getConfigurator } from './api/assets-configurator/[assetId]/get.js';
import { getHealthCheck } from './api/assets-configurator/healthcheck/get.js';

type Route = {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  action: (ctx: Koa.Context) => void;
};

const routes: Route[] = [
  {
    path: '/api/assets-configurator/healthcheck',
    method: 'get',
    action: getHealthCheck
  },
  {
    path: '/api/assets-configurator/:assetId',
    method: 'get',
    action: getConfigurator
  }
];

export const getRouter = (logging: boolean) => {
  const router = new Router();

  if (logging) console.log(`   Routes:`);

  routes.forEach((route) => {
    if (logging)
      console.log(`     ${route.method.toUpperCase()} ${route.path}`);
    router[route.method](route.path, route.action);
  });

  return router;
};
