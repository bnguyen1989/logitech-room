import { Application } from '../models/Application';
import { Logger } from '../models/Logger';

/* eslint-disable no-var */

declare global {
  var app: Application;
  var logger: Logger;
}

export {};