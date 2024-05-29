import { Application } from "../models/Application";
import { Logger } from "../models/Logger";
import { Analytics } from "../models/analytics/Analytics";

/* eslint-disable no-var */

declare global {
  var app: Application;
  var logger: Logger;
  var analytics: Analytics;
  var MktoForms2: any;
}

export {};
