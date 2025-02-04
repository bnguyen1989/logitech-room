import { Condition } from "./Condition";

export enum ConditionPropertyName {
  ACTIVE = "active",
  COUNT = "count",
}

export type ConditionPropertyNameType =
  | keyof typeof ConditionPropertyName
  | string;

export type PropertyChangesType = Record<string, any>;

export type ConditionChangeType = {
  condition: Condition;
  changes: PropertyChangesType;
};

export enum OperatorName {
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  GREATER = "greater",
  LESS = "less",
  GREATER_OR_EQUAL = "greaterOrEqual",
  LESS_OR_EQUAL = "lessOrEqual",
}

export type OperatorNameT = typeof OperatorName[keyof typeof OperatorName];

export type OperatorPropertyT = Record<
  ConditionPropertyNameType,
  OperatorNameT
>;
