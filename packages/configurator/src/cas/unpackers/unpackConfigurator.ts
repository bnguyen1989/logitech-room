import { PackedConfiguratorObject } from '../Cas.js';
import { CasAttribute } from '../configurator/attributes.js';
import {
  Metadata,
  MetadataConfiguratorArray
} from '../configurator/metadata.js';
import { Action, Condition, PackedRule } from '../configurator/rules.js';

const unpackConfiguratorObject = (configuratorStr: string) => {
  const configurator: PackedConfiguratorObject = JSON.parse(configuratorStr);
  return configurator;
};

const unpackMetadata = (metadataStr: string): Metadata => {
  const { name, defaultValue }: MetadataConfiguratorArray =
    JSON.parse(metadataStr);
  return { [name]: defaultValue };
};

const unpackAttribute = (attributeStr: string) => {
  const attribute: CasAttribute = JSON.parse(attributeStr);
  return attribute;
};

const unpackRule = (ruleStr: string) => {
  const rule: PackedRule = JSON.parse(ruleStr);
  return rule;
};

const unpackAction = (actionStr: string) => {
  const action: Action = JSON.parse(actionStr);
  return action;
};

const unpackCondition = (conditionStr: string) => {
  const condition: Condition = JSON.parse(conditionStr);
  return condition;
};

export default function unpackConfigurator(
  id: string | undefined | null,
  objects: Record<string, string>
) {
  if (!id) return undefined;
  const configuratorPacked = unpackConfiguratorObject(objects[id]);
  return {
    metadata: configuratorPacked.metadata.reduce(
      (output: Metadata, metadataId) =>
        Object.assign(output, unpackMetadata(objects[metadataId])),
      {}
    ),
    attributes: configuratorPacked.attributes.map((attrId) =>
      unpackAttribute(objects[attrId])
    ),
    rules: configuratorPacked.rules.map((ruleId) => {
      const rule = unpackRule(objects[ruleId]);
      const conditions = rule.conditions.map((conditionId) =>
        unpackCondition(objects[conditionId])
      );
      const actions = rule.actions.map((actionId) =>
        unpackAction(objects[actionId])
      );
      return { ...rule, conditions, actions };
    })
  };
}
