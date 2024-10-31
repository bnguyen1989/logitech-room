import {
  ConditionChangeType,
  ConditionPropertyName,
  ConditionPropertyNameType,
} from "./type";

export class ConditionExecutor {
  private conditionChangeMap: ConditionChangeType[] = [];

  public addConditionWithChanges(conditionChange: ConditionChangeType): this {
    this.conditionChangeMap.push(conditionChange);
    return this;
  }

  public applyChangesIfConditionsMet(
    property: Record<ConditionPropertyNameType, any>,
    allActiveNames: string[] = []
  ): Record<string, any> {
    const result: Record<string, any> = {};

    this.conditionChangeMap.forEach(({ condition, changes }) => {
      const dependentConditions = condition.getDependentConditions();
      const isValidDependentConditions = dependentConditions.every(
        (dependentCondition) =>
          dependentCondition.checkCondition({
            [ConditionPropertyName.ACTIVE]: allActiveNames.includes(
              dependentCondition.getKeyPermission()
            ),
          })
      );
      if (!isValidDependentConditions) return;
      if (
        condition.checkCondition({
          ...property,
          [ConditionPropertyName.ACTIVE]: allActiveNames.includes(
            condition.getKeyPermission()
          ),
        })
      ) {
        Object.keys(changes).forEach((key: any) => {
          result[key] = changes[key];
        });
      }
    });

    return result;
  }
}
