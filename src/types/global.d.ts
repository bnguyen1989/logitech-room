import { Application } from '../models/Application';
import { Logger } from '../models/Logger';
import { Permission } from '../models/permission/Permission'

/* eslint-disable no-var */

declare global {
  var app: Application;
  var logger: Logger;
  var permission: Permission;
}

export {};