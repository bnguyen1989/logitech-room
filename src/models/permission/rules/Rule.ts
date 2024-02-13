import { Step } from '../step/Step'


export abstract class Rule {
  public abstract name: string;


  public abstract validate(step: Step): boolean;
}
