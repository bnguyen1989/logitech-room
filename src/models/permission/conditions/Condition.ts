import { ConditionPropertyNameType } from "./type";

export class Condition {
  private keyPermission: string;
  private property: Record<ConditionPropertyNameType, any> = {};
  private dependentConditions: Condition[] = [];

  public constructor(keyPermission: string) {
    this.keyPermission = keyPermission;
  }

  public getKeyPermission(): string {
    return this.keyPermission;
  }

  public setProperty(
    property: Record<ConditionPropertyNameType, any>
  ): Condition {
    this.property = property;
    return this;
  }

  public addProperty(key: ConditionPropertyNameType, value: any): Condition {
    this.property[key] = value;
    return this;
  }

  public getProperty(): Record<ConditionPropertyNameType, any> {
    return this.property;
  }

  public addDependentCondition(condition: Condition): Condition {
    this.dependentConditions.push(condition);
    return this;
  }

  public getDependentConditions(): Condition[] {
    return this.dependentConditions;
  }

  public checkCondition(
    property: Record<ConditionPropertyNameType, any>
  ): boolean {
    const keys = Object.keys(this.property);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this.property[key] !== property[key]) {
        return false;
      }
    }
    return true;
  }

  public copy(): Condition {
    const condition = new Condition(this.keyPermission);
    condition.setProperty(this.property);
    this.dependentConditions.forEach((dependentCondition) =>
      condition.addDependentCondition(dependentCondition.copy())
    );
    return condition;
  }
}
