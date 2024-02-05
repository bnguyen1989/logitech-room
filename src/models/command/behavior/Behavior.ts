import { Command } from "../Command";

export default abstract class Behavior {
  abstract execute(command: Command): Promise<boolean>;
}
