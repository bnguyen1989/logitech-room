import {
  ConditionPropertyNameType,
  OperatorName,
  OperatorNameT,
  OperatorPropertyT,
} from "./type";

export class Condition {
  private keyPermission: string;
  private property: Record<ConditionPropertyNameType, any> = {};
  private operatorProperty: OperatorPropertyT = {};
  private dependentConditions: Condition[] = [];

  public constructor(keyPermission: string) {
    this.keyPermission = keyPermission;
  }

  public getKeyPermission(): string {
    return this.keyPermission;
  }

  public setProperty(property: Record<ConditionPropertyNameType, any>): this {
    this.property = { ...property };
    return this;
  }

  public setOperatorProperty(operatorProperty: OperatorPropertyT): this {
    this.operatorProperty = { ...operatorProperty };
    return this;
  }

  public addOperatorProperty(
    key: ConditionPropertyNameType,
    operator: OperatorNameT
  ): this {
    this.operatorProperty[key] = operator;
    return this;
  }

  public addProperty(key: ConditionPropertyNameType, value: any): this {
    this.property[key] = value;
    return this;
  }

  public getProperty(): Record<ConditionPropertyNameType, any> {
    return { ...this.property };
  }

  public addDependentCondition(condition: Condition): this {
    this.dependentConditions.push(condition);
    return this;
  }

  public getDependentConditions(): Condition[] {
    return this.dependentConditions.map((cond) => cond.copy());
  }

  public checkCondition(
    property: Record<ConditionPropertyNameType, any>
  ): boolean {
    return Object.keys(this.property).every((key) =>
      this.comparePropertyByOperator(
        key as ConditionPropertyNameType,
        property[key]
      )
    );
  }

  private comparePropertyByOperator(
    key: ConditionPropertyNameType,
    value: any
  ): boolean {
    const operator = this.operatorProperty[key];
    const targetValue = this.property[key];

    switch (operator) {
      case OperatorName.EQUAL:
        return targetValue === value;
      case OperatorName.NOT_EQUAL:
        return targetValue !== value;
      case OperatorName.GREATER:
        return value > targetValue;
      case OperatorName.LESS:
        return value < targetValue;
      case OperatorName.GREATER_OR_EQUAL:
        return value >= targetValue;
      case OperatorName.LESS_OR_EQUAL:
        return value <= targetValue;
      default:
        return targetValue === value;
    }
  }

  public copy(): Condition {
    const condition = new Condition(this.keyPermission);
    condition.setProperty({ ...this.property });
    condition.setOperatorProperty({ ...this.operatorProperty });
    this.dependentConditions.forEach((dependentCondition) =>
      condition.addDependentCondition(dependentCondition.copy())
    );
    return condition;
  }
}
