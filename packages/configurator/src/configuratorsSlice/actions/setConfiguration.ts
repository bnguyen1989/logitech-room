import { type CaseReducer, createAction } from '@reduxjs/toolkit';
import type { Configuration } from '@threekit/rest-api';

import {
  ATTRIBUTE_TYPE,
  COMPARATORS,
  RULE_ACTION
} from '../../cas/constants.js';
import type { HydratedConfiguration } from '../Configurator.js';
import type { ConfiguratorSliceState } from '../index.js';

export const setProductConfiguration = createAction<{
  key: string;
  configuration: Configuration;
}>('configurators/set-configuration');

export const setConfigurationReducer: CaseReducer<
  ConfiguratorSliceState,
  ReturnType<typeof setProductConfiguration>
> = (state, { payload }) => {
  const { key } = payload;
  if (
    key in state.activeProductConfigurators === false ||
    !payload.configuration
  )
    return;
  const { assetId } = state.activeProductConfigurators[key];

  //  The incoming configuration is using attribute names, while
  //  our internal configuration object is using attribute ids
  const deltaConfiguration = Object.entries(payload.configuration).reduce(
    (output: Configuration, [attrName, value]) => {
      const attributeId =
        state.staticProductData[assetId].attributeMap[attrName];
      const currentConfigurationVal =
        state.activeProductConfigurators[key].configuration[attributeId];

      if (
        typeof currentConfigurationVal !== 'object' &&
        currentConfigurationVal === value
      )
        return output;
      else if (
        currentConfigurationVal &&
        typeof currentConfigurationVal === 'object' &&
        'assetId' in currentConfigurationVal &&
        value &&
        typeof value === 'object' &&
        'assetId' in value &&
        currentConfigurationVal.assetId === value.assetId
      )
        return output;
      else if (
        currentConfigurationVal &&
        typeof currentConfigurationVal === 'object' &&
        'r' in currentConfigurationVal &&
        value &&
        typeof value === 'object' &&
        'r' in value &&
        JSON.stringify([
          currentConfigurationVal.r,
          currentConfigurationVal.g,
          currentConfigurationVal.b
        ]) === JSON.stringify([value.r, value.g, value.b])
      )
        return output;

      return Object.assign(output, { [attributeId]: value });
    },
    {}
  );

  if (!Object.keys(deltaConfiguration).length) return;

  const updatedConfiguration = {
    ...state.activeProductConfigurators[key].configuration,
    ...deltaConfiguration
  };

  //  We get all the properties for the asset type attribute's values
  //  in order to check for tags and run metadata queries
  const hydratedConfiguration: HydratedConfiguration = Object.entries(
    updatedConfiguration
  ).reduce((output: HydratedConfiguration, [attrId, value]) => {
    if (value && typeof value === 'object' && 'assetId' in value) {
      const attribute =
        state.activeProductConfigurators[key].attributes[attrId];
      if (attribute.type === ATTRIBUTE_TYPE.asset)
        return Object.assign(output, {
          [attrId]:
            attribute.values.find((val) => val.assetId === value.assetId) ??
            value
        });
    }
    return Object.assign(output, { [attrId]: value });
  }, {});

  state.staticProductData[assetId].rules.forEach((rule) => {
    if (rule.disabled) return;
    //  By default we run the actions. If a condition fails
    //  then we don't run the rules.
    let shouldRun = true;

    for (let i = 0; i < rule.conditions.length && shouldRun; i++) {
      const condition = rule.conditions[i];
      const configurationToCheck = hydratedConfiguration[condition.attributeId];

      // The has changed condition is attribute type agnostic
      //  so we start with that
      if (condition.comparator === COMPARATORS.hasChanged) {
        if (condition.attributeId in deltaConfiguration === false) {
          shouldRun = false;
          continue;
        }
      }

      //  All other condition checks will be dependent on
      //  attribute type so we start by getting that out
      const attributeType =
        state.activeProductConfigurators[key]?.attributes[condition.attributeId]
          ?.type;
      if (!attributeType) continue;

      //  For these upcoming attribute we only have
      //  equality checks...
      if (
        attributeType === ATTRIBUTE_TYPE.string ||
        attributeType === ATTRIBUTE_TYPE.number ||
        attributeType === ATTRIBUTE_TYPE.boolean ||
        attributeType === ATTRIBUTE_TYPE.color
      ) {
        if (
          condition.comparator === COMPARATORS.equal ||
          condition.comparator === COMPARATORS.notEqual
        ) {
          if (
            typeof configurationToCheck === 'object' ||
            typeof configurationToCheck !== typeof condition.value
          )
            continue;
          const doesMatch = condition.value === configurationToCheck;
          if (
            (!doesMatch && condition.comparator === COMPARATORS.equal) ||
            (doesMatch && condition.comparator === COMPARATORS.notEqual)
          )
            shouldRun = false;
        } else if (
          condition.comparator === COMPARATORS.includes ||
          condition.comparator === COMPARATORS.excludes
        ) {
          if (typeof configurationToCheck === 'string') {
            //  @ts-ignore
            const doesInclude = configurationToCheck.includes(condition.value);
            if (
              (!doesInclude && condition.comparator === COMPARATORS.includes) ||
              (doesInclude && condition.comparator === COMPARATORS.excludes)
            ) {
              shouldRun = false;
            }
          }
        }
      }
      //  For the asset type attribute we have an equality
      //  check and a metadata query.
      //  For the equality check we have to check the
      //  the attribute value against a set of assetIds
      //  defined by a list of both assetId and tagIds.
      else if (attributeType === ATTRIBUTE_TYPE.asset) {
        if (
          (typeof configurationToCheck === 'object' &&
            'assetId' in configurationToCheck) === false
        )
          continue;
        if (
          condition.comparator === COMPARATORS.equal ||
          condition.comparator === COMPARATORS.notEqual
        ) {
          if (
            typeof configurationToCheck !== 'object' ||
            !('assetId' in configurationToCheck) ||
            !Array.isArray(condition.value)
          )
            continue;
          let conditionPass = false;
          for (let j = 0; j < condition.value.length && !conditionPass; j++) {
            const conditionVal = condition.value[j];

            const doesMatch =
              typeof conditionVal === 'string'
                ? configurationToCheck.tags.includes(conditionVal)
                : ('assetId' in conditionVal &&
                    configurationToCheck.assetId === conditionVal.assetId) ||
                  ('tagId' in conditionVal &&
                    configurationToCheck.tagids.includes(conditionVal.tagId));

            if (
              (doesMatch && condition.comparator === COMPARATORS.equal) ||
              (!doesMatch && condition.comparator === COMPARATORS.notEqual)
            )
              conditionPass = true;
          }

          if (!conditionPass) shouldRun = false;
        } else if (condition.comparator === COMPARATORS.metadata) {
          const metadataConditions = condition.value;
          if (
            metadataConditions.assetType === 'item' &&
            typeof configurationToCheck === 'object' &&
            'assetId' in configurationToCheck
          ) {
            let conditionPass = true;
            for (
              let j = 0;
              j < metadataConditions.conditions.length && conditionPass;
              j++
            ) {
              const metadataCondition = metadataConditions.conditions[j];
              const doesMatch =
                configurationToCheck.metadata[metadataCondition.key] ===
                metadataCondition.value;

              if (
                (!doesMatch &&
                  metadataCondition.comparator === COMPARATORS.equalAlt) ||
                (doesMatch &&
                  metadataCondition.comparator === COMPARATORS.notEqual)
              )
                conditionPass = false;
            }
            if (!conditionPass) shouldRun = false;
          }
        }
      }
    }

    if (!shouldRun) return;

    //  The actions are actually pretty straight forward;
    //  we can either:
    //  * Update an attribute(s) properties
    //  * Update an attribute's option(s) properties
    rule.actions.forEach((action) => {
      const attribute =
        state.activeProductConfigurators[key].attributes[action.attributeId];
      switch (action.type) {
        case RULE_ACTION.setAttributeVisible:
        case RULE_ACTION.setAttributeEnabled:
          Object.assign(
            attribute,
            'visible' in action ? { visible: action.visible } : undefined,
            'enabled' in action ? { enabled: action.enabled } : undefined
          );
          break;
        case RULE_ACTION.setAttributeValueVisibility:
        case RULE_ACTION.setAttributeValueEnabled:
          if (attribute.type !== ATTRIBUTE_TYPE.asset) break;
          if (!action.values?.length) break;
          if (action.values.includes('*')) {
            attribute.values.forEach((val) => {
              Object.assign(
                val,
                'visible' in action ? { visible: action.visible } : undefined,
                'enabled' in action ? { enabled: action.enabled } : undefined
              );
            });
          } else {
            const assetIdsToUpdate = new Set<string>([]);
            const tagIdsToUpdate = new Set<string>([]);
            action.values.forEach((val) => {
              if (typeof val === 'string') assetIdsToUpdate.add(val);
              else if ('tagId' in val) tagIdsToUpdate.add(val.tagId);
            });
            attribute.values.forEach((val) => {
              let doesMatch = false;
              if (assetIdsToUpdate.has(val.assetId)) doesMatch = true;

              for (let i = 0; i < val.tagids.length && !doesMatch; i++)
                if (tagIdsToUpdate.has(val.tagids[i])) doesMatch = true;

              if (doesMatch) {
                Object.assign(
                  val,
                  'visible' in action ? { visible: action.visible } : undefined,
                  'enabled' in action ? { enabled: action.enabled } : undefined
                );
              }
            });
          }
          break;
        default:
      }
    });
  });

  state.activeProductConfigurators[key].configuration = updatedConfiguration;
};
