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





// type nameAttributeType = string;
// export type ConditionMountType = Record<nameAttributeType, number>;

// type ActionMountType = {
//   nameNodes: string[];
// };

// export type ruleMountsType = {
//   condition: ConditionMountType;
//   action: ActionMountType;
// };
