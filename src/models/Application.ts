import { Configurator } from "./configurator/Configurator";
import EventEmitter from "events";
import { WorkSpace } from "./workSpace/WorkSpace";
import { Command } from "./command/Command";
import { Logger } from "./Logger";

declare const logger: Logger;

export class Application {
  private _currentConfigurator: Configurator = new Configurator();
  public workSpace: WorkSpace;
  public eventEmitter: EventEmitter = new EventEmitter();

  constructor() {
    this.workSpace = new WorkSpace(this.currentConfigurator);
  }

  public get currentConfigurator(): Configurator {
    return this._currentConfigurator;
  }

  public set currentConfigurator(configurator: Configurator) {
    this._currentConfigurator = configurator;
    this.workSpace.configurator = configurator;
  }

  public executeCommand(command: Command): Promise<boolean> {
    return new Promise((resolve) => {
      command.execute().then((res) => {
        if (!res) {
          resolve(false);
          return;
        }

        this.eventEmitter.emit("configuratorProcessing", true);
        const changeProperties = command.getChangeProperties();
        return this.workSpace.updateProperties(changeProperties).then(() => {
          logger.log("ExecuteCommand", command);
          this.eventEmitter.emit("executeCommand", command);
          this.eventEmitter.emit("configuratorProcessing", false);
          return resolve(true);
        });
      });
    });
  }
}
