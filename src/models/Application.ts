import { Configurator } from "./configurator/Configurator";
import EventEmitter from "events";
import { Command } from "./command/Command";
import { Logger } from "./Logger";
import { AddItemCommand } from "./command/AddItemCommand";
import { ChangeCountItemCommand } from "./command/ChangeCountItemCommand";
import { ChangeColorItemCommand } from "./command/ChangeColorItemCommand";
import { RemoveItemCommand } from "./command/RemoveItemCommand";
import { ChangeStepCommand } from "./command/ChangeStepCommand";
import { DataTable } from "./dataTable/DataTable";
import { ChangeSelectItemCommand } from "./command/ChangeSelectItemCommand";
import { ConfigurationConstraintHandler } from "./handlers/ConfigurationConstraintHandler";
import { StepName } from "../utils/baseUtils";

declare const logger: Logger;

export class Application {
  private _currentConfigurator: Configurator = new Configurator();
  public eventEmitter: EventEmitter = new EventEmitter();
  public dataTableLevel1: DataTable = new DataTable([]);
  public dataTableLevel2: DataTable = new DataTable([]);


  public resetApplication(): void {
    this.currentConfigurator = new Configurator();
    this.dataTableLevel1 = new DataTable([]);
    this.dataTableLevel2 = new DataTable([]);
  }

  public get currentConfigurator(): Configurator {
    return this._currentConfigurator;
  }

  public set currentConfigurator(configurator: Configurator) {
    this._currentConfigurator = configurator;
  }

  public addItemConfiguration(
    nameProperty: string,
    assetId: string,
    keyItemPermission: string
  ): Promise<boolean> {
    return this.executeCommand(
      new AddItemCommand(
        this.currentConfigurator,
        nameProperty,
        assetId,
        keyItemPermission
      )
    );
  }

  public removeItem(
    nameProperty: string,
    keyItemPermission: string
  ): Promise<boolean> {
    return this.executeCommand(
      new RemoveItemCommand(
        this.currentConfigurator,
        nameProperty,
        keyItemPermission
      )
    );
  }

  public changeCountItemConfiguration(
    nameProperty: string,
    value: string,
    keyItemPermission: string
  ): Promise<boolean> {
    return this.executeCommand(
      new ChangeCountItemCommand(
        this.currentConfigurator,
        nameProperty,
        value,
        keyItemPermission
      )
    );
  }

  public changeColorItemConfiguration(
    nameProperty: string,
    value: string,
    keyItemPermission: string
  ): Promise<boolean> {
    return this.executeCommand(
      new ChangeColorItemCommand(
        this.currentConfigurator,
        nameProperty,
        value,
        keyItemPermission
      )
    );
  }

  public changeStep(stepName: StepName): Promise<boolean> {
    return this.executeCommand(
      new ChangeStepCommand(this.currentConfigurator, stepName)
    );
  }

  public changeSelectItemConfiguration(
    nameProperty: string,
    assetId: string,
    keyItemPermission: string
  ): Promise<boolean> {
    return this.executeCommand(
      new ChangeSelectItemCommand(
        this.currentConfigurator,
        nameProperty,
        assetId,
        keyItemPermission
      )
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

        return new ConfigurationConstraintHandler(
          this.currentConfigurator,
          this.dataTableLevel1,
          this.dataTableLevel2
        )
          .handle()
          .then(() => {
            this.eventEmitter.emit("executeCommand", command);
            logger.log("ExecuteCommand", command);
            return resolve(true);
          });
      });
    });
  }
}
