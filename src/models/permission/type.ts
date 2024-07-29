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
 * @example
 * {
 *  "nameAttribute": {
 *    "nameAttributeElement": {
 *      "nameNodes": ["nameElement"],
 *      "value": 1
 *      }
 *    }
 * }
 */
export type ConditionAttributesMountType = Record<
  string,
  Record<
    string,
    {
      nameNodes: string[];
      value: any;
    }
  >
>;

// type nameAttributeType = string;
// export type ConditionMountType = Record<nameAttributeType, number>;

// type ActionMountType = {
//   nameNodes: string[];
// };

// export type ruleMountsType = {
//   condition: ConditionMountType;
//   action: ActionMountType;
// };
