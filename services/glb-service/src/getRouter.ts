import Router from '@koa/router';
import Koa from 'koa';

import { getHealthCheck } from './api/glb/healthcheck/get.js';
import { getGlbOptimize } from './api/glb/optimize/get.js';

type Route = {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
  action: (ctx: Koa.Context) => void;
};

const routes: Route[] = [
  {
    path: '/api/glb/healthcheck',
    method: 'get',
    action: getHealthCheck
  },
  {
    path: '/api/glb/optimize',
    method: 'get',
    action: getGlbOptimize
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
