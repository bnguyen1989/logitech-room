import { Condition } from "./Condition";
import { ConditionChangeType, PropertyChangesType } from "./type";

export class ConditionChangeBuilder {
  private condition: Condition | null = null;
  private changes: PropertyChangesType = {};

  public setCondition(condition: Condition): this {
    this.condition = condition;
    return this;
  }

  public addChange(key: string, value: any): this {
    this.changes[key] = value;
    return this;
  }

  public build(): ConditionChangeType {
    if (!this.condition) {
      throw new Error("Condition must be set before building.");
    }
    return {
      condition: this.condition,
      changes: this.changes,
    };
  }
}
