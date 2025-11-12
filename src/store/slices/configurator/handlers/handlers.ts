import { Store } from "@reduxjs/toolkit";
import { CardI } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueConfiguration,
  changeValueNodes,
  disabledHighlightNode,
  removeHighlightNodesByKeys,
  removeNodeByKeys,
  removeNodes,
  removeValuesConfigurationByKeys,
  setHighlightNodes,
  setPopuptNodes,
} from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { MountElement } from "../../../../models/permission/elements/mounts/MountElement";
import { CountableMountElement } from "../../../../models/permission/elements/mounts/CountableMountElement";
import {
  getAssetFromCard,
  getCardByKeyPermission,
  getDataStepByName,
  getIsSelectedCardByKeyPermission,
  getPermission,
  getPropertyCounterCardByKeyPermission,
  getPropertyDisplayCardByKeyPermission,
  getStepNameByKeyPermission,
} from "../../ui/selectors/selectors";
import {
  getAssetIdByNameNode,
  getNodes,
  isMountedCard,
} from "../selectors/selectors";
import { ReferenceMountElement } from "../../../../models/permission/elements/mounts/ReferenceMountElement";
import { StepName } from "../../../../utils/baseUtils";
import { AttributeMountElement } from "../../../../models/permission/elements/mounts/AttributeMountElement";
import { Configuration } from "@threekit/rest-api";
import {
  getTVMountByName,
  isCameraElement,
  TVName,
} from "../../../../utils/permissionUtils";

export const updateDisplayNode = (displayType: TVName, stepName: StepName) => {
  return (store: Store) => {
    const state = store.getState();
    const tvMount = getTVMountByName(displayType);

    const nameNode = tvMount.getNameNode();

    const card = getCardByKeyPermission(stepName, tvMount.name)(state);
    const asset = getAssetFromCard(card)(state);

    setElementByNameNode(asset.id, tvMount.getNameNode())(store);
    store.dispatch(disabledHighlightNode(nameNode));
  };
};

export const updateDisplayNodeByKeyPermission = (
  keyPermission: string,
  stepName: StepName
) => {
  return (store: Store) => {
    if (stepName !== StepName.ConferenceCamera) return;
    if (!isCameraElement(keyPermission)) return;
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    const element = step.getElementByName(keyPermission);
    if (element?.getHiddenDisplay()) return;

    const displayType = getPropertyDisplayCardByKeyPermission(
      stepName,
      keyPermission
    )(state);

    if (!displayType) return;
    updateDisplayNode(displayType, stepName)(store);
  };
};

export const setHighlightAllNodes = (isHighlight: boolean) => {
  return (store: Store) => {
    const state = store.getState();
    const nodes = isHighlight ? getNodes(state) : {};

    store.dispatch(
      setPopuptNodes({
        ...Object.keys(nodes).reduce<Record<string, boolean>>((acc, curr) => {
          return {
            ...acc,
            [curr]: isHighlight,
          };
        }, {}),
      })
    );
    updateHighlightNodes(nodes)(store);
  };
};

export const updateHighlightNodes = (nodes: Record<string, string>) => {
  return (store: Store) => {
    const newHighlightNodes: Record<string, boolean> = {};
    const nodeNames = Object.keys(nodes);
    nodeNames.forEach((name) => {
      const arrName = name.split("_");
      const lastElement = arrName[arrName.length - 1];
      const isLastElementNumber =
        !isNaN(parseFloat(lastElement)) && isFinite(parseFloat(lastElement));

      if (isLastElementNumber) {
        arrName.pop();
      }

      const nodeName = arrName.join("_");
      newHighlightNodes[nodeName] = true;
    });

    store.dispatch(setHighlightNodes(newHighlightNodes));
  };
};

export function deleteNodesByCards(cards: Array<CardI>) {
  return (store: Store) => {
    const assetIds = cards.reduce<string[]>((acc, curr) => {
      const dataThreekit = curr.dataThreekit;
      const threekitItems = Object.values(dataThreekit.threekitItems);
      const assetIds = threekitItems.map((item) => item.id);

      return acc.concat(assetIds);
    }, []);
    const state = store.getState();
    const nodes = getNodes(state);
    const keys = Object.keys(nodes);
    const keysForRemove = keys.filter((key) => assetIds.includes(nodes[key]));
    clearAllNodes(keysForRemove)(store);
  };
}

export function clearAllNodes(nodesArr?: string[]) {
  return (store: Store) => {
    const state = store.getState();
    const nodes = getNodes(state);
    const keys = nodesArr ?? Object.keys(nodes);
    store.dispatch(removeNodeByKeys(keys));
    store.dispatch(removeValuesConfigurationByKeys(keys));
    store.dispatch(removeHighlightNodesByKeys(keys));
  };
}

export function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const state = store.getState();
    const configuration = configurator.getConfiguration();
    const step = getDataStepByName(stepName)(state);
    arrayAttributes.forEach((item) => {
      const [name] = item;
      const value = configuration[name];

      if (!(typeof value === "object")) return;

      if (value.assetId.length) {
        const card: CardI | undefined = findCard(
          (card) => getAssetFromCard(card)(state)?.id === value.assetId,
          Object.values(step.cards)
        );
        if (!card) return;

        const count = getPropertyCounterCardByKeyPermission(
          stepName,
          card.keyPermission
        )(state);

        const isMounted = isMountedCard(card, stepName)(value.assetId)(state);
        if (isMounted) return;
        addElement(card, stepName, count)(store);

        const minCount = card.counter?.min;
        if (minCount !== undefined && count && count > minCount + 1) {
          for (let i = minCount + 1; i < count; i++) {
            changeCountElement(card.keyPermission, stepName, i + 1, {
              [card.keyPermission]: i,
            })(store);
          }
        }
      }
    });
  };
}

function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,
      })
    );
  };
}

function setConfiguratorByNameNode(
  nameNode: string,
  configuration: Configuration
) {
  return (store: Store) => {
    store.dispatch(
      changeValueConfiguration({
        key: nameNode,
        value: configuration,
      })
    );
  };
}

export function addElement(
  card: CardI,
  stepName: StepName,
  countValue?: number
) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card || !step) {
      console.warn("⚠️ [addElement] Missing card or step:", {
        card: !!card,
        step: !!step,
      });
      return;
    }

    const cardAsset = getAssetFromCard(card)(state);
    console.log("🔵 [addElement] Called for:", card.keyPermission, {
      cardAssetId: cardAsset?.id,
      stepName,
    });

    const element = step.getElementByName(card.keyPermission);
    if (!element) {
      console.warn("⚠️ [addElement] Element not found:", card.keyPermission);
      return;
    }

    // Debug: Log element type
    console.log("🔍 [addElement] Element type check:", {
      keyPermission: card.keyPermission,
      elementType: element.constructor.name,
      isItemElement: element instanceof ItemElement,
      isMountElement: element instanceof MountElement,
      element: element,
      elementName: element.name,
    });

    const bundleMountApply = (element: ItemElement) => {
      const bundleMount = permission.getBundleMountElementsByName(element.name);
      bundleMount.forEach((mount) => {
        const stepNameCard = getStepNameByKeyPermission(mount.name)(state);
        const card = getCardByKeyPermission(
          stepNameCard ?? stepName,
          mount.name
        )(state);
        if (!card) return;
        const cardAsset = getAssetFromCard(card)(state);

        if (mount instanceof CountableMountElement) {
          mount.getAvailableNameNode().forEach((nameNode) => {
            setElementByNameNode(cardAsset.id, nameNode)(store);
          });
        } else {
          setElementByNameNode(cardAsset.id, mount.getNameNode())(store);
        }
        updateNameNodesByCondition(mount, cardAsset.id)(store);
      });
    };

    if (element instanceof ItemElement) {
      console.log("✅ [addElement] Element is ItemElement, proceeding...");
      bundleMountApply(element);

      const defaultMount = element.getDefaultMount();
      console.log("🔍 [addElement] DefaultMount check:", {
        hasDefaultMount: !!defaultMount,
        defaultMountType: defaultMount?.constructor.name,
        isCountableMountElement: defaultMount instanceof CountableMountElement,
        isMountElement: defaultMount instanceof MountElement,
        defaultMount: defaultMount,
      });

      if (defaultMount instanceof CountableMountElement) {
        if (!card.counter) return;
        const dependentMount = defaultMount.getDependentMount();
        if (!dependentMount) {
          if (countValue) {
            const matchingMountRulse = defaultMount.getMatchingMountRule({
              count: countValue,
            });

            if (matchingMountRulse && matchingMountRulse.action) {
              const action = matchingMountRulse.action;

              let assetId = cardAsset.id;
              if (card.keyPermission !== matchingMountRulse.keyPermission) {
                const stepNameElement = getStepNameByKeyPermission(
                  matchingMountRulse.keyPermission
                )(state);
                const cardElement = getCardByKeyPermission(
                  stepNameElement,
                  matchingMountRulse.keyPermission
                )(state);
                assetId = getAssetFromCard(cardElement)(state).id;
              }

              if (action.add && action.add.nameNodes) {
                action.add.nameNodes.forEach((nameNode) => {
                  setElementByNameNode(assetId, nameNode)(store);
                });
              }
              if (action.remove && action.remove.nameNodes) {
                store.dispatch(removeNodeByKeys(action.remove.nameNodes));
              }

              if (assetId === cardAsset.id) return;
            }
          }

          defaultMount.setActiveIndex(card.counter.min);
          const nodeName = defaultMount.next().getNameNode();

          setElementByNameNode(cardAsset.id, nodeName)(store);
          updateNameNodesByCondition(defaultMount, cardAsset.id)(store);
          return;
        }

        if (!(dependentMount instanceof ReferenceMountElement)) return;

        const referenceElement = step.getElementByName(dependentMount.name);
        if (!(referenceElement instanceof ItemElement)) return;
        const referenceMount = referenceElement.getDefaultMount();
        if (!(referenceMount instanceof CountableMountElement)) return;

        const autoChangeItems = element.getAutoChangeItems();
        const keyAutoChange = Object.keys(autoChangeItems)[0];
        const selectAutoChange = getIsSelectedCardByKeyPermission(
          stepName,
          keyAutoChange
        )(state);

        const autoChangeElement = step.getElementByName(keyAutoChange);
        if (!(autoChangeElement instanceof ItemElement)) return;
        const autoChangeMount = autoChangeElement.getDefaultMount();
        if (!(autoChangeMount instanceof CountableMountElement)) return;

        if (selectAutoChange) {
          autoChangeMount.next();
          store.dispatch(removeNodeByKeys([autoChangeMount.getNameNode()]));
        } else {
          const availableReferenceNameNodes =
            referenceMount.getAvailableNameNode();
          store.dispatch(removeNodeByKeys(availableReferenceNameNodes));
          const autoChangeElementNameNodes = autoChangeMount.getRangeNameNode();
          store.dispatch(removeNodeByKeys(autoChangeElementNameNodes));
        }

        const availableCurrentNameNodes = defaultMount.getAvailableNameNode();
        setAssetIdNodeNames(availableCurrentNameNodes, cardAsset.id)(store);
        const cardReference = getCardByKeyPermission(
          stepName,
          dependentMount.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);
        setElementByNameNode(
          cardAssetReference.id,
          dependentMount.getNameNode()
        )(store);
      } else if (defaultMount instanceof MountElement) {
        if (defaultMount instanceof AttributeMountElement) {
          setConfiguratorByNameNode(
            defaultMount.getNameNode(),
            defaultMount.getAttributes()
          )(store);
        }
        const nodes = getNodes(state);
        const existDependentMountName = element
          .getDependenceMount()
          .map((mount) => mount.getDependentMount()?.getNameNode())
          .find((item) => item && nodes[item]);
        if (existDependentMountName) {
          setElementByNameNode(cardAsset.id, existDependentMountName)(store);
          return;
        }

        const dependentMount = defaultMount.getDependentMount();
        if (!dependentMount) {
          const nodeName = defaultMount.getNameNode();
          console.log("✅ [addElement] Setting node mapping:", {
            nodeName,
            assetId: cardAsset.id,
            keyPermission: card.keyPermission,
          });
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(cardAsset.id, nodeName)(store);
          return;
        }
        store.dispatch(changeStatusProcessing(true));
        const dependentCard = getCardByKeyPermission(
          stepName,
          dependentMount.name
        )(state);
        if (!dependentCard) return;
        const value = getAssetIdByNameNode(dependentMount.getNameNode())(state);
        const dependentCardAsset = getAssetFromCard(dependentCard)(state);
        if (value !== dependentCardAsset.id)
          setElementByNameNode(
            dependentCardAsset.id,
            defaultMount.getNameNode()
          )(store);
        setElementByNameNode(cardAsset.id, dependentMount.getNameNode())(store);
      }
    } else if (element instanceof MountElement) {
      const itemElement = step.getActiveItemElementByMountName(element.name);
      if (!itemElement) return;
      updateDisplayNodeByKeyPermission(itemElement.name, stepName)(store);
      bundleMountApply(itemElement);
      const cardItemElement = getCardByKeyPermission(
        stepName,
        itemElement.name
      )(state);
      if (!cardItemElement) return;
      const cardItemElementAsset = getAssetFromCard(cardItemElement)(state);
      const dependentMount = element.getDependentMount();
      if (!dependentMount) {
        if (element instanceof AttributeMountElement) {
          setConfiguratorByNameNode(
            element.getNameNode(),
            element.getAttributes()
          )(store);
        }
        store.dispatch(changeStatusProcessing(true));
        store.dispatch(removeNodes(cardItemElementAsset.id));
        store.dispatch(removeNodes(cardAsset.id));
        setElementByNameNode(
          cardItemElementAsset.id,
          element.getNameNode()
        )(store);
        return;
      }
      const dependenceMount = itemElement.getDependenceMount();
      const keysForRemove = dependenceMount.map((mount) => mount.getNameNode());
      store.dispatch(removeNodes(cardItemElementAsset.id));
      store.dispatch(removeNodeByKeys(keysForRemove));
      store.dispatch(changeStatusProcessing(true));
      const dependentCard = getCardByKeyPermission(
        stepName,
        dependentMount.name
      )(state);
      const dependentCardAsset = getAssetFromCard(dependentCard)(state);
      setElementByNameNode(dependentCardAsset.id, element.getNameNode())(store);
      setElementByNameNode(
        cardItemElementAsset.id,
        dependentMount.getNameNode()
      )(store);
    }
  };
}

export function removeElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();

    if (!card || !step) return;

    const cardAsset = getAssetFromCard(card)(state);
    if (!cardAsset) return;

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const bundleMount = permission.getBundleMountElementsByName(element.name);
      const nameNodesBundle = bundleMount.map((mount) => {
        if (mount instanceof CountableMountElement) {
          return mount.getAvailableNameNode();
        }

        return mount.getNameNode();
      });
      store.dispatch(removeNodeByKeys([...nameNodesBundle.flat()]));

      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        if (!card.counter) return;

        const dependentMount = mountElement.getDependentMount();
        if (!dependentMount) {
          mountElement.setMin(card.counter.min);
          mountElement.setMax(card.counter.max);
          const names = mountElement.getAvailableNameNode();
          store.dispatch(removeNodeByKeys(names));
          const autoChangeItems = element.getAutoChangeItems();
          Object.entries(autoChangeItems).forEach(([key, arr]) => {
            if (!arr.includes("count")) return;
            const element = step.getElementByName(key);
            if (!(element instanceof ItemElement)) return;
            const defaultMount = element.getDefaultMount();
            if (!(defaultMount instanceof CountableMountElement)) return;
            if (!card.counter) return;
            defaultMount.setMin(0);
            defaultMount.setMax(card.counter.max);
            const dependentMount = defaultMount.getDependentMount();
            if (!(dependentMount instanceof ReferenceMountElement)) return;
            const nameNodes = defaultMount.getRangeNameNode();
            store.dispatch(
              removeNodeByKeys([...nameNodes, dependentMount.getNameNode()])
            );
          });
          updateNameNodesByCondition(mountElement, cardAsset.id)(store);
        }

        if (!(dependentMount instanceof ReferenceMountElement)) return;

        const referenceElement = step.getElementByName(dependentMount.name);
        if (!(referenceElement instanceof ItemElement)) return;
        const referenceMount = referenceElement.getDefaultMount();
        if (!(referenceMount instanceof CountableMountElement)) return;

        const cardReference = getCardByKeyPermission(
          stepName,
          dependentMount.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);

        const autoChangeItems = element.getAutoChangeItems();
        const keyAutoChange = Object.keys(autoChangeItems)[0];
        const selectAutoChange = getIsSelectedCardByKeyPermission(
          stepName,
          keyAutoChange
        )(state);

        const currentNameNodes = mountElement.getRangeNameNode();
        store.dispatch(
          removeNodeByKeys([...currentNameNodes, dependentMount.getNameNode()])
        );

        if (selectAutoChange) {
          const autoChangeElement = step.getElementByName(keyAutoChange);
          if (!(autoChangeElement instanceof ItemElement)) return;
          const autoChangeMount = autoChangeElement.getDefaultMount();
          if (!(autoChangeMount instanceof CountableMountElement)) return;
          const autoChangeDependentMount = autoChangeMount.getDependentMount();
          if (!(autoChangeDependentMount instanceof ReferenceMountElement))
            return;
          const autoChangeNameNodes = autoChangeMount.getAvailableNameNode();
          const cardAutoChange = getCardByKeyPermission(
            stepName,
            keyAutoChange
          )(state);
          const cardAssetAutoChange = getAssetFromCard(cardAutoChange)(state);
          setAssetIdNodeNames(
            autoChangeNameNodes,
            cardAssetAutoChange.id
          )(store);
          setElementByNameNode(
            cardAssetReference.id,
            autoChangeDependentMount.getNameNode()
          )(store);
          return;
        }
        const availableNameNodes = referenceMount.getAvailableNameNode();
        setAssetIdNodeNames(availableNameNodes, cardAssetReference.id)(store);
      } else if (mountElement instanceof MountElement) {
        const dependenceMount = element.getDependenceMount();
        const keysForRemove = dependenceMount.map((mount) =>
          mount.getNameNode()
        );
        const listNodes = [...keysForRemove, mountElement.getNameNode()];
        store.dispatch(removeNodeByKeys(listNodes));
        store.dispatch(removeValuesConfigurationByKeys(listNodes));
      }
    }
    console.log("🔵 [removeElement] Called for:", card.keyPermission, {
      cardAssetId: cardAsset?.id,
      stepName,
      element,
      elementInstance: element instanceof MountElement,
    });
    if (element instanceof MountElement) {
      const itemElement = step.getActiveItemElementByMountName(element.name);
      if (!(itemElement instanceof ItemElement)) return;
      const defaultMount = itemElement.getDefaultMount();
      if (!defaultMount) return;
      const cardItemElement = getCardByKeyPermission(
        stepName,
        itemElement.name
      )(state);
      const cardItemElementAsset = getAssetFromCard(cardItemElement)(state);
      store.dispatch(removeNodes(cardItemElementAsset.id));
      store.dispatch(removeNodes(cardAsset.id));
      addElement(cardItemElement, stepName)(store);
    }

    store.dispatch(removeNodes(cardAsset.id));
  };
}

export function changeColorElement(
  keyItemPermission: string,
  stepName: StepName
) {
  return (store: Store) => {
    const state = store.getState();
    const card = getCardByKeyPermission(stepName, keyItemPermission)(state);
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card || !step) return;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      const autoChangeItems = element.getAutoChangeItems();

      if (defaultMount instanceof CountableMountElement) {
        if (!card.counter) return;

        const names = defaultMount.getAvailableNameNode();

        if (!names.length) return;

        Object.entries(autoChangeItems).forEach(([key, arr]) => {
          if (!arr.includes("count")) return;
          const isSelectElement = getIsSelectedCardByKeyPermission(
            stepName,
            key
          )(state);
          if (isSelectElement) return;
          const element = step.getElementByName(key);
          if (!(element instanceof ItemElement)) return;
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof CountableMountElement)) return;
          if (!card.counter) return;
          defaultMount.setMin(card.counter.min);
          defaultMount.setMax(card.counter.max);
          const dependentMount = defaultMount.getDependentMount();
          if (!(dependentMount instanceof ReferenceMountElement)) return;
          store.dispatch(
            removeNodeByKeys([
              ...defaultMount.getRangeNameNode(),
              dependentMount.getNameNode(),
            ])
          );
        });
        const notActiveAutoItems = Object.entries(autoChangeItems).filter(
          ([key, arr]) => {
            if (!arr.includes("count")) return false;
            return !getIsSelectedCardByKeyPermission(stepName, key)(state);
          }
        );

        if (
          !Object.keys(autoChangeItems).length ||
          notActiveAutoItems.length === Object.keys(autoChangeItems).length
        ) {
          setAssetIdNodeNames(names, cardAsset.id)(store);
          return;
        }
        return;
      } else {
        if (!(defaultMount instanceof MountElement)) return;
        if (Object.keys(autoChangeItems).length) {
          Object.entries(autoChangeItems).forEach(([key, arr]) => {
            if (!arr.includes("color") || key === defaultMount.name) return;

            const stepNameItem = getStepNameByKeyPermission(key)(state);
            const stepItem = permission.getStepByName(stepNameItem);

            const isSelectElement = getIsSelectedCardByKeyPermission(
              stepNameItem,
              key
            )(state);
            if (!isSelectElement) {
              const dependentDefaultMount = defaultMount.getDependentMount();
              if (!(dependentDefaultMount instanceof MountElement)) return;

              const cardDefaultElement = getCardByKeyPermission(
                stepNameItem,
                defaultMount.name
              )(state);
              const cardDefaultAssetElement =
                getAssetFromCard(cardDefaultElement)(state);
              setElementByNameNode(
                cardDefaultAssetElement.id,
                defaultMount.getNameNode()
              )(store);
              setElementByNameNode(
                cardAsset.id,
                dependentDefaultMount.getNameNode()
              )(store);
              return;
            }
            const elementMount = stepItem.getElementByName(key);
            if (!(elementMount instanceof MountElement)) return;
            const elementDependentMount = elementMount.getDependentMount();
            if (!(elementDependentMount instanceof MountElement)) return;

            const cardElement = getCardByKeyPermission(
              stepNameItem,
              key
            )(state);
            const cardAssetElement = getAssetFromCard(cardElement)(state);

            setElementByNameNode(
              cardAssetElement.id,
              elementMount.getNameNode()
            )(store);
            setElementByNameNode(
              cardAsset.id,
              elementDependentMount.getNameNode()
            )(store);
          });
          return;
        }
      }
    }
    addElement(card, stepName)(store);
  };
}

export function changeCountElement(
  keyItemPermission: string,
  stepName: StepName,
  value: number,
  prevValues: Record<string, number>
) {
  return (store: Store) => {
    const state = store.getState();
    const card = getCardByKeyPermission(stepName, keyItemPermission)(state);
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card.counter || !step) return;

    const prevValue = prevValues[keyItemPermission];
    const isIncrease = value > prevValue;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);

    const removeElement = () => {
      const nameProperty = card.dataThreekit.attributeName;
      app.removeItem(nameProperty, card.keyPermission);
    };

    if (element instanceof MountElement && value === card.counter.min) {
      removeElement();
    }

    if (!element || !(element instanceof ItemElement)) return;

    const mountElement = element.getDefaultMount();

    if (!mountElement && value === card.counter.min) {
      removeElement();
      return;
    }

    const isCountableMountElement =
      mountElement instanceof CountableMountElement;

    if (!isCountableMountElement && value === card.counter.min) {
      removeElement();
      return;
    }

    if (!isCountableMountElement) return;

    if (value) {
      const matchingMountRulse = mountElement.getMatchingMountRule({
        count: value,
      });

      if (matchingMountRulse && matchingMountRulse.action) {
        const action = matchingMountRulse.action;

        let assetId = cardAsset.id;
        if (card.keyPermission !== matchingMountRulse.keyPermission) {
          const stepNameElement = getStepNameByKeyPermission(
            matchingMountRulse.keyPermission
          )(state);
          const cardElement = getCardByKeyPermission(
            stepNameElement,
            matchingMountRulse.keyPermission
          )(state);
          assetId = getAssetFromCard(cardElement)(state).id;
        }

        if (action.add && action.add.nameNodes) {
          action.add.nameNodes.map((nameNode) => {
            return setElementByNameNode(assetId, nameNode)(store);
          });
        }
        if (action.remove && action.remove.nameNodes) {
          store.dispatch(removeNodeByKeys(action.remove.nameNodes));
        }

        if (assetId === cardAsset.id) return;
      }
    }

    const prevValueAutoChangeItems: Record<string, number> = {};
    const autoChangeItems = element.getAutoChangeItems();
    Object.keys(autoChangeItems).forEach((key) => {
      const count = prevValues[key];
      prevValueAutoChangeItems[key] = count;
    });
    const isChangeAutoItems = !!Object.keys(autoChangeItems).length;

    if (!isChangeAutoItems) {
      if (isIncrease) {
        const nodeName = mountElement.getNameNode();

        setElementByNameNode(cardAsset.id, nodeName)(store);
      } else {
        mountElement.setActiveIndex(prevValue);
        const nodeName = mountElement.getNameNode();
        store.dispatch(removeNodeByKeys([nodeName]));
      }
      if (value === card.counter.min) {
        removeElement();
      }
      return;
    }

    const countPrevActiveAutoItem = Object.values(
      prevValueAutoChangeItems
    ).reduce((acc, v) => {
      if (v !== 0 && v) return acc + 1;
      return acc;
    }, 0);

    const activeAutoItemArr = Object.entries(autoChangeItems)
      .filter(([key, arr]) => {
        if (!arr.includes("count")) return false;
        return getIsSelectedCardByKeyPermission(stepName, key)(state);
      })
      .map(([key]) => key);
    const allActive =
      activeAutoItemArr.length === Object.keys(autoChangeItems).length;
    const isOneActive =
      !allActive &&
      activeAutoItemArr.length === 1 &&
      countPrevActiveAutoItem === 1;
    const activeOneButPrevStepActiveAll =
      !allActive &&
      activeAutoItemArr.length === 1 &&
      countPrevActiveAutoItem === Object.keys(autoChangeItems).length;

    const dependentMount = mountElement.getDependentMount();
    if (!dependentMount) {
      if (isOneActive) {
        const [key] = activeAutoItemArr;
        const element = step.getElementByName(key);
        if (!(element instanceof ItemElement)) return;
        const defaultMount = element.getDefaultMount();
        if (!(defaultMount instanceof CountableMountElement)) return;
        const dependentMount = defaultMount.getDependentMount();

        if (!(dependentMount instanceof ReferenceMountElement)) return;

        const availableNameNodes = defaultMount.getAvailableNameNode();
        const lastNode = availableNameNodes[availableNameNodes.length - 1];
        const cardElement = getCardByKeyPermission(stepName, key)(state);
        const cardAssetElement = getAssetFromCard(cardElement)(state);
        if (isIncrease) {
          setElementByNameNode(cardAssetElement.id, lastNode)(store);
          setElementByNameNode(
            cardAsset.id,
            dependentMount.getNameNode()
          )(store);
        } else {
          defaultMount.setMin(card.counter.min);
          defaultMount.setMax(card.counter.max);
          defaultMount.setActiveIndex(prevValue);
          const nodeName = defaultMount.getNameNode();
          store.dispatch(removeNodeByKeys([nodeName]));
        }
        defaultMount.setActiveIndex(value);
        updateNameNodesByCondition(defaultMount, cardAssetElement.id)(store);
      } else if (allActive) {
        activeAutoItemArr.forEach((key) => {
          const count = getPropertyCounterCardByKeyPermission(
            stepName,
            key
          )(state);
          if (count === undefined) return;
          const prevCount = prevValues[key];
          if (prevCount === undefined) return;
          if (count === prevCount) return;
          const element = step.getElementByName(key);
          if (!(element instanceof ItemElement)) return;
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof CountableMountElement)) return;
          const dependentMount = defaultMount.getDependentMount();
          if (!(dependentMount instanceof ReferenceMountElement)) return;

          if (isIncrease) {
            const availableNameNodes = defaultMount.getAvailableNameNode();
            const lastNode = availableNameNodes[availableNameNodes.length - 1];
            const cardElement = getCardByKeyPermission(stepName, key)(state);
            const cardAssetElement = getAssetFromCard(cardElement)(state);
            setElementByNameNode(cardAssetElement.id, lastNode)(store);
            setElementByNameNode(
              cardAsset.id,
              dependentMount.getNameNode()
            )(store);
          } else {
            defaultMount.next();
            const nodeName = defaultMount.getNameNode();
            store.dispatch(removeNodeByKeys([nodeName]));
          }
        });
      } else if (activeOneButPrevStepActiveAll && !isIncrease) {
        Object.keys(autoChangeItems).forEach((key) => {
          const isSelectElement = getIsSelectedCardByKeyPermission(
            stepName,
            key
          )(state);
          if (isSelectElement) return;
          const element = step.getElementByName(key);
          if (!(element instanceof ItemElement)) return;
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof CountableMountElement)) return;
          const dependentMount = defaultMount.getDependentMount();
          if (!(dependentMount instanceof ReferenceMountElement)) return;

          defaultMount.next();
          const nodeName = defaultMount.getNameNode();
          store.dispatch(
            removeNodeByKeys([nodeName, dependentMount.getNameNode()])
          );
        });
      } else {
        if (isIncrease) {
          const nodeName = mountElement.getNameNode();
          setElementByNameNode(cardAsset.id, nodeName)(store);
        } else {
          mountElement.setActiveIndex(prevValue);
          const nodeName = mountElement.getNameNode();
          store.dispatch(removeNodeByKeys([nodeName]));
        }
        mountElement.setActiveIndex(value);
        updateNameNodesByCondition(mountElement, cardAsset.id)(store);
      }
    } else {
      if (!(dependentMount instanceof ReferenceMountElement)) return;

      Object.entries(autoChangeItems).forEach(([key, arr]) => {
        if (!arr.includes("count")) return;
        const element = step.getElementByName(key);
        if (!(element instanceof ItemElement)) return;
        const defaultMount = element.getDefaultMount();
        if (!(defaultMount instanceof CountableMountElement)) return;
        const dependentMount = defaultMount.getDependentMount();
        if (!(dependentMount instanceof ReferenceMountElement)) return;

        if (isIncrease) {
          defaultMount.next();
          const nameNode = defaultMount.getNameNode();
          store.dispatch(removeNodeByKeys([nameNode]));
        } else {
          const availableNameNodes = defaultMount.getAvailableNameNode();
          const autoChangeCard = getCardByKeyPermission(stepName, key)(state);
          const autoChangeAsset = getAssetFromCard(autoChangeCard)(state);
          setAssetIdNodeNames(availableNameNodes, autoChangeAsset.id)(store);
          const cardReference = getCardByKeyPermission(
            stepName,
            dependentMount.name
          )(state);
          const cardAssetReference = getAssetFromCard(cardReference)(state);
          setElementByNameNode(
            cardAssetReference.id,
            dependentMount.getNameNode()
          )(store);
        }
      });

      if (isIncrease) {
        const availableNameNodes = mountElement.getAvailableNameNode();
        setAssetIdNodeNames(availableNameNodes, cardAsset.id)(store);

        const cardReference = getCardByKeyPermission(
          stepName,
          dependentMount.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);
        setElementByNameNode(
          cardAssetReference.id,
          dependentMount.getNameNode()
        )(store);
      } else {
        mountElement.setActiveIndex(prevValue);
        const nodeName = mountElement.getNameNode();
        store.dispatch(removeNodeByKeys([nodeName]));
      }
    }

    if (value === card.counter.min && !element.getRequired()) {
      removeElement();
    }
  };
}

function findCard(
  callback: (card: CardI) => boolean,
  cards: Array<CardI>
): Required<CardI> | undefined {
  const card = cards.find((card: CardI) => callback(card));

  return card as Required<CardI>;
}

function setAssetIdNodeNames(namesNode: Array<string>, assetId: string) {
  return (store: Store) => {
    namesNode.forEach((name) => {
      setElementByNameNode(assetId, name)(store);
    });
  };
}

function updateNameNodesByCondition(
  mountElement: MountElement,
  assetId: string
) {
  return (store: Store) => {
    const removeNameNodes = mountElement.getNodeNamesConditionRemove();
    if (removeNameNodes.length) {
      store.dispatch(removeNodeByKeys(removeNameNodes));
      let availableNameNodes = [mountElement.getNameNode()];
      if (mountElement instanceof CountableMountElement) {
        availableNameNodes = mountElement.getAvailableNameNode();
      }
      setAssetIdNodeNames(availableNameNodes, assetId)(store);
    }
  };
}
