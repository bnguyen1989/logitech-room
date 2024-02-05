import { Logger } from '../models/Logger';
import { Application } from '../models/Application';


export const initApplication = () => {
  const app: Application = new Application();
  
  global['app'] = app;
  global['logger'] = new Logger();
};