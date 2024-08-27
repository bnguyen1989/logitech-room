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
  keyPermission: string;
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
  keyPermission: string;
  condition: ConditionMountType;
  action: ActionMountType;
};

export class RuleManagerMount {
  public static createRuleObject({
    condition,
    action,
    keyPermission,
  }: createRuleObject) {
    return {
      keyPermission: keyPermission,
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
