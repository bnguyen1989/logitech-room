import { ItemElement } from "./elements/ItemElement";

export type PropertyDependentElement = Record<
  string,
  {
    active: boolean;
    property?: Record<string, any>;
  }
>;

export type DependentElement = Record<
  string,
  Array<ItemElement | Array<ItemElement>>
>;

/**
 * @description is needed to describe the behavior of an attribute and its value based on the condition
 */
export type ConditionAttributesMountType = Record<
  string,
  Record<
    string,
    {
      condition: PropertyDependentElement;
      value: any;
    }
  >
>;
