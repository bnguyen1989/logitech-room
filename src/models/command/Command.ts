import { Configurator } from "../configurator/Configurator";
import { NamePropertiesConfiguratorType } from "../configurator/type";
import { IdGenerator } from "../IdGenerator";
import Behavior from "./behavior/Behavior";

export abstract class Command {
  public id: string = IdGenerator.generateId();
  protected abstract name: string;
  protected _configurator: Configurator;
  protected behaviors: Array<Behavior> = new Array<Behavior>();
  protected changeProperties: Array<NamePropertiesConfiguratorType> = [];

  constructor(configurator: Configurator) {
    this._configurator = configurator;
  }

  public get configurator() {
    return this._configurator;
  }

  public set configurator(configurator: Configurator) {
    this._configurator = configurator;
  }

  public abstract serialize(): object;

  public compare(command: Command): boolean {
    return this.id === command.id;
  }

  public getChangeProperties(): Array<NamePropertiesConfiguratorType> {
    return this.changeProperties;
  }

  protected abstract executeCommand(): boolean;

  public execute(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.executeBehaviors()
        .then((response) => {
          if (response) {
            const res = this.executeCommand();
            resolve(res);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private executeBehaviors(): Promise<boolean> {
    if (this.behaviors.length > 0) {
      return this.executeBehavior(0);
    } else {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  }

  private executeBehavior(index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.behaviors[index]
        .execute(this)
        .then((res) => {
          if (index === this.behaviors.length - 1) {
            resolve(res);
          } else {
            if (res) {
              this.executeBehavior(index + 1)
                .then((resNext) => {
                  resolve(resNext && res);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(res);
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
