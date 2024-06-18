import { Store } from "@reduxjs/toolkit";
import { CardI } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueConfiguration,
  changeValueNodes,
  disabledHighlightNode,
  removeNodeByKeys,
  removeNodes,
  removeValuesConfigurationByKeys,
  setHighlightNodes,
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
  getSelectData,
} from "../../ui/selectors/selectors";
import { getAssetIdByNameNode, getNodes } from "../selectors/selectors";
import { ReferenceMountElement } from "../../../../models/permission/elements/mounts/ReferenceMountElement";
import { StepName } from "../../../../utils/baseUtils";
import { AttributeMountElement } from "../../../../models/permission/elements/mounts/AttributeMountElement";
import { Configuration } from "@threekit/rest-api";
import { getTVMountBySettings } from "../../../../utils/permissionUtils";

export const setDefaultsNode = (stepName: StepName) => {
  return (store: Store) => {
    const state = store.getState();
    if (stepName !== StepName.ConferenceCamera) return;

    const selectData = getSelectData(state);
    const keyPermissions = [StepName.RoomSize, StepName.Platform].map((key) => {
      const data = selectData[key];
      return Object.values(data).find((item) => item.selected.length > 0)
        ?.selected[0];
    });
    const { 0: keyPermissionRoom, 1: keyPermissionPlatform } = keyPermissions;
    if (!keyPermissionRoom || !keyPermissionPlatform) return;
    const tvMount = getTVMountBySettings(
      keyPermissionRoom,
      keyPermissionPlatform
    );

    const nameNode = tvMount.getNameNode();
    const nodes = getNodes(state);
    if (nodes[nameNode]) return;

    const card = getCardByKeyPermission(stepName, tvMount.name)(state);
    const asset = getAssetFromCard(card)(state);

    setElementByNameNode(asset.id, tvMount.getNameNode())(store);
    store.dispatch(disabledHighlightNode(nameNode));
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
    store.dispatch(removeNodeByKeys(keysForRemove));
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

        const nodes = getNodes(state);
        const keys = Object.keys(nodes);
        const key = keys.find((key) => nodes[key] === value.assetId);
        if (key) return;
        addElement(card, stepName)(store);
        if (count && count > 1) {
          changeCountElement(card.keyPermission, stepName, count, {
            [card.keyPermission]: 1,
          })(store);
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

export function addElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card || !step) return;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const bundleMount = permission.getBundleMountElementsByName(element.name);
      bundleMount.forEach((mount) => {
        const card = getCardByKeyPermission(stepName, mount.name)(state);
        if (!card) return;
        const cardAsset = getAssetFromCard(card)(state);
        setElementByNameNode(cardAsset.id, mount.getNameNode())(store);
      });

      const defaultMount = element.getDefaultMount();

      if (defaultMount instanceof CountableMountElement) {
        if (!card.counter) return;
        const dependentMount = defaultMount.getDependentMount();
        if (!dependentMount) {
          defaultMount.setActiveIndex(0);
          const nodeName = defaultMount.next().getNameNode();
          setElementByNameNode(cardAsset.id, nodeName)(store);
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
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(cardAsset.id, defaultMount.getNameNode())(store);
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
      store.dispatch(
        removeNodeByKeys([...bundleMount.map((mount) => mount.getNameNode())])
      );

      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        if (!card.counter) return;

        const dependentMount = mountElement.getDependentMount();
        if (!dependentMount) {
          mountElement.setMin(card.counter.min);
          mountElement.setMax(card.counter.max);
          store.dispatch(removeNodes(cardAsset.id));
          const names = mountElement.getRangeNameNode();
          store.dispatch(removeNodeByKeys(names));
          const autoChangeItems = element.getAutoChangeItems();
          Object.entries(autoChangeItems).forEach(([key, arr]) => {
            if (!arr.includes("count")) return;
            const element = step.getElementByName(key);
            if (!(element instanceof ItemElement)) return;
            const defaultMount = element.getDefaultMount();
            if (!(defaultMount instanceof CountableMountElement)) return;
            if (!card.counter) return;
            defaultMount.setMin(card.counter.min);
            defaultMount.setMax(card.counter.max);
            const dependentMount = defaultMount.getDependentMount();
            if (!(dependentMount instanceof ReferenceMountElement)) return;
            const nameNodes = defaultMount.getRangeNameNode();
            store.dispatch(
              removeNodeByKeys([...nameNodes, dependentMount.getNameNode()])
            );
          });
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

            const isSelectElement = getIsSelectedCardByKeyPermission(
              stepName,
              key
            )(state);
            if (!isSelectElement) {
              const dependentDefaultMount = defaultMount.getDependentMount();
              if (!(dependentDefaultMount instanceof MountElement)) return;

              const cardDefaultElement = getCardByKeyPermission(
                stepName,
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
            const elementMount = step.getElementByName(key);
            if (!(elementMount instanceof MountElement)) return;
            const elementDependentMount = elementMount.getDependentMount();
            if (!(elementDependentMount instanceof MountElement)) return;

            const cardElement = getCardByKeyPermission(stepName, key)(state);
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
      store.dispatch(removeNodes(cardAsset.id));
      const nameProperty = card.dataThreekit.attributeName;
      app.removeItem(nameProperty, card.keyPermission);
    };

    if (element instanceof MountElement && value === 0) {
      removeElement();
    }

    if (!element || !(element instanceof ItemElement)) return;

    const mountElement = element.getDefaultMount();

    if (!mountElement && value === 0) {
      removeElement();
      return;
    }

    const isCountableMountElement =
      mountElement instanceof CountableMountElement;

    if (!isCountableMountElement && value === 0) {
      removeElement();
      return;
    }

    if (!isCountableMountElement) return;

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
      if (value === 0) {
        removeElement();
      }
      return;
    }

    const countPrevActiveAutoItem = Object.values(
      prevValueAutoChangeItems
    ).reduce((acc, v) => {
      if (v !== 0) return acc + 1;
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

    if (value === 0) {
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
