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
