import { Logger } from "../models/Logger";
import { Application } from "../models/Application";
import { Analytics } from "../models/analytics/Analytics";

export const initApplication = () => {
  const app: Application = new Application();

  global["app"] = app;
  global["logger"] = new Logger();
  global["analytics"] = new Analytics();
};
