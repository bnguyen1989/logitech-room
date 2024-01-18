import { z } from 'zod';

import { COMPARATORS, RULE_ACTION } from '../constants.js';

const TagIdObject = z.object({ tagId: z.string().uuid() });

const MetadataCondition = z.object({
  key: z.string(),
  comparator: z.union([
    z.literal(COMPARATORS.equalAlt),
    z.literal(COMPARATORS.notEqual)
  ]),
  value: z.string()
});

/*****************************************************
 * Conditions
 ****************************************************/

const CompareEqualityCondition = z.object({
  comparator: z.union([
    z.literal(COMPARATORS.equal),
    z.literal(COMPARATORS.notEqual)
  ]),
  attributeId: z.string().uuid(),
  value: z.union([
    z.string(),
    z.boolean(),
    z.array(
      z.union([
        TagIdObject,
        z.object({
          assetId: z.string().uuid()
        })
      ])
    )
  ])
});

const CompareIncludeExcludeCondition = z.object({
  comparator: z.union([
    z.literal(COMPARATORS.includes),
    z.literal(COMPARATORS.excludes)
  ]),
  attributeId: z.string().uuid(),
  value: z.string()
});

const CompareMetadataCondition = z.object({
  comparator: z.literal(COMPARATORS.metadata),
  attributeId: z.string().uuid(),
  value: z.object({
    assetType: z.union([z.literal('item'), z.literal('asset')]),
    conditions: z.array(MetadataCondition)
  })
});

const CompareHasChangedCondition = z.object({
  comparator: z.literal(COMPARATORS.hasChanged),
  attributeId: z.string().uuid(),
  value: z.literal('')
});

export const Condition = z.union([
  CompareEqualityCondition,
  CompareIncludeExcludeCondition,
  CompareMetadataCondition,
  CompareHasChangedCondition
]);

/*****************************************************
 * Actions
 ****************************************************/

const SetAttributeValueVisibilityAction = z.object({
  attributeId: z.string().uuid(),
  type: z.literal(RULE_ACTION.setAttributeValueVisibility),
  values: z.array(z.union([z.literal('*'), z.string().uuid(), TagIdObject])),
  visible: z.boolean()
});

const SetAttributeValueEnabledAction = z.object({
  attributeId: z.string().uuid(),
  type: z.literal(RULE_ACTION.setAttributeValueEnabled),
  values: z.array(z.union([z.literal('*'), z.string().uuid(), TagIdObject])),
  enabled: z.boolean()
});

const SetAttributeEnabledAction = z.object({
  attributeId: z.string().uuid(),
  type: z.literal(RULE_ACTION.setAttributeEnabled),
  enabled: z.boolean()
});

const SetAttributeVisibleAction = z.object({
  attributeId: z.string().uuid(),
  type: z.literal(RULE_ACTION.setAttributeVisible),
  visible: z.boolean()
});

export const Action = z.union([
  SetAttributeEnabledAction,
  SetAttributeVisibleAction,
  SetAttributeValueEnabledAction,
  SetAttributeValueVisibilityAction
]);

export const Rule = z.object({
  name: z.string(),
  actions: z.array(Action),
  conditions: z.array(Condition),
  disabled: z.boolean().optional()
});

export const PackedRule = Rule.pick({ name: true, disabled: true }).merge(
  z.object({
    actions: z.array(z.string()),
    conditions: z.array(z.string())
  })
);

export type Condition = z.infer<typeof Condition>;
export type Action = z.infer<typeof Action>;
export type Rule = z.infer<typeof Rule>;
export type PackedRule = z.infer<typeof PackedRule>;
