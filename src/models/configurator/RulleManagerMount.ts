export type nameAttributeType = string;
export type ConditionMountType = Record<nameAttributeType, number>;

export type ActionMountType = {
  add: {
    nameNodes: string[];
  };
  remove: {
    nameNodes: string[];
  };
};

export type ruleMountsType = {
  condition: ConditionMountType;
  action: ActionMountType;
};

type generateStrictAttributeRuleType = {
  setNodes: string[];
  remoteNodes: string[];
};
type generateActionAddNodesAndRemoveNodesType = {
  nameAttribute: nameAttributeType;
  valueAttribute: any;
};
type createRuleObject = {
  condition: ConditionMountType;
  action: ActionMountType;
};

export class RulleManagerMount {
  public static createRuleObject({ condition, action }: createRuleObject) {
    return {
      condition: condition,
      action: action,
    };
  }

  public static generateStrictAttributeRule({
    nameAttribute,
    valueAttribute,
  }: generateActionAddNodesAndRemoveNodesType): ConditionMountType {
    return {
      [nameAttribute]: valueAttribute,
    };
  }
  public static generateActionAddNodesAndRemoveNodes({
    setNodes,
    remoteNodes,
  }: generateStrictAttributeRuleType): ActionMountType {
    return {
      add: {
        nameNodes: setNodes,
      },
      remove: {
        nameNodes: remoteNodes,
      },
    };
  }
}

// {
//   condition: {
//     count: 1,
//   },
//   action: {
//     add: {
//       nameNodes: [PlacementManager.getNameNodeForCamera("Wall", 4)],
//     },
//     remove: {
//       nameNodes: [
//         PlacementManager.getNameNodeForCamera("Wall", 2),
//         PlacementManager.getNameNodeForCamera("Wall", 3),
//       ],
//     },
//   },
// },
