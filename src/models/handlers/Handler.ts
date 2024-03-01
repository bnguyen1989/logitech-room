import { Configurator } from "../configurator/Configurator";

export abstract class Handler {
  public abstract handle(configurator: Configurator): Promise<boolean>;
}
