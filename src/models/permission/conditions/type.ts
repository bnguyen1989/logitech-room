export enum ConditionPropertyName {
  ACTIVE = "active",
  COUNT = "count",
}

export type ConditionPropertyNameType =
  | keyof typeof ConditionPropertyName
  | string;
