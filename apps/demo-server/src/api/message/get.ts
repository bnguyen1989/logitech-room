import Koa from 'koa';

export const getMessage = async (ctx: Koa.Context) => {
  ctx.body = 'Hello World!';
};
