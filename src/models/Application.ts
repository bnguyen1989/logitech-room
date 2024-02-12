import { Configurator } from "./configurator/Configurator";
import EventEmitter from "events";
import { WorkSpace } from "./workSpace/WorkSpace";
import { Command } from "./command/Command";
import { Logger } from "./Logger";
import { AddItemCommand } from "./command/AddItemCommand";
import { ChangeCountItemCommand } from "./command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "./command/ChangeColorItemCommand";
import { RemoveItemCommand } from './command/RemoveItemCommand'

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

  public addItemConfiguration(
    nameProperty: string,
    assetId: string
  ): Promise<boolean> {
    const asset = this.workSpace.getAssetById(assetId);
    if (!asset) {
      return Promise.resolve(false);
    }
    return this.executeCommand(
      new AddItemCommand(this.currentConfigurator, nameProperty, asset)
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
