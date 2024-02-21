import { Configurator } from "./configurator/Configurator";
import EventEmitter from "events";
import { Command } from "./command/Command";
import { Logger } from "./Logger";
import { AddItemCommand } from "./command/AddItemCommand";
import { ChangeCountItemCommand } from "./command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "./command/ChangeColorItemCommand";
import { RemoveItemCommand } from './command/RemoveItemCommand'

declare const logger: Logger;

export class Application {
  private _currentConfigurator: Configurator = new Configurator();
  public eventEmitter: EventEmitter = new EventEmitter();


  public get currentConfigurator(): Configurator {
    return this._currentConfigurator;
  }

  public set currentConfigurator(configurator: Configurator) {
    this._currentConfigurator = configurator;
  }

  public addItemConfiguration(
    nameProperty: string,
    assetId: string
  ): Promise<boolean> {
    return this.executeCommand(
      new AddItemCommand(this.currentConfigurator, nameProperty, assetId)
    );
  }

  public removeItem(
    nameProperty: string,
    assetId: string
  ): Promise<boolean> {
    return this.executeCommand(
      new RemoveItemCommand(this.currentConfigurator, nameProperty, assetId)
    );
  }

  public changeCountItemConfiguration(
    nameProperty: string,
    value: string,
    assetId: string
  ): Promise<boolean> {
    return this.executeCommand(
      new ChangeCountItemCommand(
        this.currentConfigurator,
        nameProperty,
        value,
        assetId
      )
    );
  }

  public changeColorItemConfiguration(
    value: string,
    assetId: string
  ): Promise<boolean> {
    return this.executeCommand(
      new ChangeColorItemCommand(this.currentConfigurator, value, assetId)
    );
  }

  public executeCommand(command: Command): Promise<boolean> {
    this.eventEmitter.emit("configuratorProcessing", true);
    return new Promise((resolve) => {
      command.execute().then((res) => {
        this.eventEmitter.emit("configuratorProcessing", false);
        if (!res) {
          resolve(false);
          return;
        }

        this.eventEmitter.emit("executeCommand", command);
        logger.log("ExecuteCommand", command);
        return resolve(true);
      });
    });
  }
}
