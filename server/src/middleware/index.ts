import { dataLangFile } from "./dataLangMiddleware";
import { Express } from 'express';

export function applyServerHardening(app: Express): void {
  app.use(dataLangFile);
}
