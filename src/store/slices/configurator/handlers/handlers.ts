import { Store } from "@reduxjs/toolkit";
import { CardI } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueNodes,
  removeNodeByKeys,
  removeNodes,
} from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { StepName } from "../../../../models/permission/type";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { MountElement } from "../../../../models/permission/elements/mounts/MountElement";
import { CountableMountElement } from "../../../../models/permission/elements/mounts/CountableMountElement";
import { setPropertyItem } from "../../ui/Ui.slice";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getDataStepByName,
  getIsSelectedCardByKeyPermission,
  getPermission,
} from "../../ui/selectors/selectors";
import { getAssetIdByNameNode, getNodes } from "../selectors/selectors";
import { ReferenceMountElement } from "../../../../models/permission/elements/mounts/ReferenceMountElement";

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

        const nodes = getNodes(state);
        const keys = Object.keys(nodes);
        const key = keys.find((key) => nodes[key] === value.assetId);
        if (key) return;
        addElement(card, stepName)(store);
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

export function addElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card || !step) return;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();

      if (defaultMount instanceof CountableMountElement) {
        if (!card.counter) return;
        defaultMount.setActiveIndex(0);
        const nodeName = defaultMount.next().getNameNode();
        setElementByNameNode(cardAsset.id, nodeName)(store);
      } else if (defaultMount instanceof ReferenceMountElement) {
        const elementReference = step.getElementByName(defaultMount.name);
        if (!(elementReference instanceof ItemElement)) return;
        const mountElement = elementReference.getDefaultMount();
        if (!(mountElement instanceof CountableMountElement)) return;
        if (!card.counter) return;
        const nameNodes = mountElement.getRangeNameNode();
        const dependentMount = defaultMount.getDependentMount();
        if (!dependentMount) {
          updateAssetIdNodeNames(nameNodes, cardAsset.id)(store);
        }

        if (dependentMount instanceof CountableMountElement) {
          const nameNodeForRemove = mountElement.getNameNode();
          store.dispatch(removeNodeByKeys([nameNodeForRemove]));
          dependentMount.setActiveIndex(0);
          const nodeName = dependentMount.next().getNameNode();
          setElementByNameNode(cardAsset.id, nodeName)(store);
        }

        const cardReference = getCardByKeyPermission(
          stepName,
          defaultMount.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);
        setElementByNameNode(
          cardAssetReference.id,
          defaultMount.getNameNode()
        )(store);
      } else if (defaultMount instanceof MountElement) {
        const dependentMount = defaultMount.getDependentMount();
        if (dependentMount) {
          const nodes = getNodes(state);
          const existDependentMountName = element
            .getDependenceMount()
            .map((mount) => mount.getDependentMount()?.getNameNode())
            .find((item) => item && nodes[item]);
          if (existDependentMountName) {
            setElementByNameNode(cardAsset.id, existDependentMountName)(store);
          } else {
            store.dispatch(changeStatusProcessing(true));
            const dependentCard = getCardByKeyPermission(
              stepName,
              dependentMount.name
            )(state);
            if (dependentCard) {
              const value = nodes[defaultMount.getNameNode()];
              const dependentCardAsset = getAssetFromCard(dependentCard)(state);
              if (value !== dependentCardAsset.id)
                setElementByNameNode(
                  dependentCardAsset.id,
                  defaultMount.getNameNode()
                )(store);
              setElementByNameNode(
                cardAsset.id,
                dependentMount.getNameNode()
              )(store);
            }
          }
        } else {
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(cardAsset.id, defaultMount.getNameNode())(store);
        }
      }
    } else if (element instanceof MountElement) {
      const itemElement = step.getActiveItemElementByMountName(element.name);
      if (!itemElement) return;
      const cardItemElement = getCardByKeyPermission(
        stepName,
        itemElement.name
      )(state);
      const cardItemElementAsset = getAssetFromCard(cardItemElement)(state);
      if (cardItemElement) {
        const dependentMount = element.getDependentMount();
        if (dependentMount) {
          const keysForRemove =
            itemElement
              ?.getDependenceMount()
              .map((mount) => mount.getNameNode()) || [];
          store.dispatch(removeNodes(cardItemElementAsset.id));
          store.dispatch(removeNodeByKeys(keysForRemove));
          store.dispatch(changeStatusProcessing(true));
          const dependentCard = getCardByKeyPermission(
            stepName,
            dependentMount.name
          )(state);
          const dependentCardAsset = getAssetFromCard(dependentCard)(state);
          if (dependentCard) {
            setElementByNameNode(
              dependentCardAsset.id,
              element.getNameNode()
            )(store);
            setElementByNameNode(
              cardItemElementAsset.id,
              dependentMount.getNameNode()
            )(store);
          }
        } else {
          store.dispatch(changeStatusProcessing(true));
          store.dispatch(removeNodes(cardItemElementAsset.id));
          store.dispatch(removeNodes(cardAsset.id));
          setElementByNameNode(
            cardItemElementAsset.id,
            element.getNameNode()
          )(store);
        }
      }
    }
  };
}

export function removeElement(card: CardI) {
  return (store: Store) => {
    const state = store.getState();
    const activeStep = getActiveStep(state);
    const permission = getPermission(activeStep)(state);
    const step = permission.getCurrentStep();

    if (!card || !step) return;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        if (!card.counter) return;
        mountElement.setMin(card.counter.min);
        mountElement.setMax(card.counter.max);
        store.dispatch(removeNodes(cardAsset.id));
        const names = mountElement.getRangeNameNode();
        store.dispatch(removeNodeByKeys(names));
      } else if (mountElement instanceof ReferenceMountElement) {
        const elementReference = step.getElementByName(mountElement.name);
        if (!(elementReference instanceof ItemElement)) return;
        const mountElementReference = elementReference.getDefaultMount();
        if (!(mountElementReference instanceof CountableMountElement)) return;
        if (!card.counter) return;
        const namesNode = mountElementReference.getRangeNameNode();
        const cardReference = getCardByKeyPermission(
          activeStep,
          mountElement.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);
        const dependentMount = mountElement.getDependentMount();
        if (!dependentMount) {
          const activeNameNodes = getActiveNameNodes(namesNode)(store);
          setAssetIdNodeNames(activeNameNodes, cardAssetReference.id)(store);
          store.dispatch(removeNodeByKeys([mountElement.getNameNode()]));
        }

        if (dependentMount instanceof CountableMountElement) {
          dependentMount.setMin(mountElementReference.min);
          dependentMount.setMax(mountElementReference.max);
          const namesNodeDependent = dependentMount.getRangeNameNode();
          store.dispatch(removeNodeByKeys(namesNodeDependent));
          const availableNodeNames =
            mountElementReference.getAvailableNameNode();

          const notActiveNameNodes =
            getNotActiveNodes(availableNodeNames)(store);

          const keysActiveChange = Object.keys(
            elementReference.getAutoChangeItems()
          );
          const keyAutoChangeItem = keysActiveChange[0];
          if (keyAutoChangeItem) {
            const isSelectElement = getIsSelectedCardByKeyPermission(
              activeStep,
              keyAutoChangeItem
            )(state);
            if (isSelectElement) {
              const elementActiveChange =
                step.getElementByName(keyAutoChangeItem);
              if (!(elementActiveChange instanceof ItemElement)) return;
              const mountElementActiveChange =
                elementActiveChange.getDefaultMount();
              if (!(mountElementActiveChange instanceof ReferenceMountElement))
                return;
              const cardActiveChange = getCardByKeyPermission(
                activeStep,
                keyAutoChangeItem
              )(state);
              const cardAssetActiveChange =
                getAssetFromCard(cardActiveChange)(state);
              setAssetIdNodeNames(
                notActiveNameNodes,
                cardAssetActiveChange.id
              )(store);
              setElementByNameNode(
                cardAssetReference.id,
                mountElementActiveChange.getNameNode()
              )(store);
              return;
            }
          }

          setAssetIdNodeNames(notActiveNameNodes, cardAssetReference.id)(store);
        }
      } else if (mountElement instanceof MountElement) {
        store.dispatch(removeNodeByKeys([mountElement.getNameNode()]));
      }
    }
    if (element instanceof MountElement) {
      const itemElement = permission
        .getCurrentStep()
        ?.getActiveItemElementByMountName(element.name);
      if (itemElement instanceof ItemElement) {
        const defaultMount = itemElement.getDefaultMount();
        const cardItemElement = getCardByKeyPermission(
          activeStep,
          itemElement.name
        )(state);
        const cardItemElementAsset = getAssetFromCard(cardItemElement)(state);
        if (defaultMount && cardItemElement) {
          const dependentMount = defaultMount.getDependentMount();
          if (dependentMount) {
            store.dispatch(changeStatusProcessing(true));
            const dependentCard = getCardByKeyPermission(
              activeStep,
              dependentMount.name
            )(state);
            const dependentCardAsset = getAssetFromCard(dependentCard)(state);
            if (dependentCard) {
              store.dispatch(removeNodes(cardItemElementAsset.id));
              setElementByNameNode(
                dependentCardAsset.id,
                defaultMount.getNameNode()
              )(store);
              setElementByNameNode(
                cardItemElementAsset.id,
                dependentMount.getNameNode()
              )(store);
            }
          } else {
            store.dispatch(removeNodes(cardItemElementAsset.id));
            store.dispatch(changeStatusProcessing(true));
            setElementByNameNode(
              cardItemElementAsset.id,
              defaultMount.nodeName
            )(store);
          }
        }
      }
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

        const names = defaultMount.getRangeNameNode();

        if (!names.length) return;
        const prevAssetId = getAssetIdByNameNode(names[0])(state);
        if (!prevAssetId) {
          store.dispatch(
            setPropertyItem({
              step: stepName,
              keyItemPermission,
              property: {
                count: 1,
              },
            })
          );
          addElement(card, stepName)(store);
          return;
        }

        if (!Object.keys(autoChangeItems).length) {
          updateAssetIdNodeNames(names, cardAsset.id)(store);
          return;
        }

        Object.entries(autoChangeItems).forEach(([key, arr]) => {
          if (!arr.includes("color")) return;
          const isSelectElement = getIsSelectedCardByKeyPermission(
            stepName,
            key
          )(state);
          if (!isSelectElement) {
            updateAssetIdNodeNames(names, cardAsset.id)(store);
            return;
          }
          const element = step.getElementByName(key);
          if (!(element instanceof ItemElement)) return;
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof ReferenceMountElement)) return;
          const cardElement = getCardByKeyPermission(stepName, key)(state);
          const cardAssetElement = getAssetFromCard(cardElement)(state);

          updateAssetIdNodeNames(names, cardAssetElement.id)(store);
          setElementByNameNode(cardAsset.id, defaultMount.getNameNode())(store);
        });
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
  prevValue: number
) {
  return (store: Store) => {
    const state = store.getState();
    const card = getCardByKeyPermission(stepName, keyItemPermission)(state);
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card.counter || !step) return;

    const isIncrease = value > prevValue;

    const cardAsset = getAssetFromCard(card)(state);

    const element = step.getElementByName(card.keyPermission);
    if (!element || !(element instanceof ItemElement)) return;

    const mountElement = element.getDefaultMount();

    if (!mountElement) return;

    const removeElement = () => {
      store.dispatch(removeNodes(cardAsset.id));
      const nameProperty = card.dataThreekit.attributeName;
      app.removeItem(nameProperty, card.keyPermission);
    };

    if (mountElement instanceof ReferenceMountElement) {
      const element = step.getElementByName(mountElement.name);
      if (!(element instanceof ItemElement)) return;
      const defaultMountElement = element.getDefaultMount();
      if (!(defaultMountElement instanceof CountableMountElement)) return;
      const namesNodeElement = defaultMountElement.getRangeNameNode();
      const activeNameNodes = getActiveNameNodes(namesNodeElement)(store);
      const cardElement = getCardByKeyPermission(
        stepName,
        mountElement.name
      )(state);
      const cardAssetElement = getAssetFromCard(cardElement)(state);
      const dependentMount = mountElement.getDependentMount();
      if (!(dependentMount instanceof CountableMountElement)) return;
      dependentMount.setActiveIndex(prevValue);
      if (isIncrease) {
        const lastNameNode = activeNameNodes[activeNameNodes.length - 1];
        const nodeName = dependentMount.next().getNameNode();
        setElementByNameNode(cardAsset.id, nodeName)(store);
        setElementByNameNode(
          cardAssetElement.id,
          mountElement.getNameNode()
        )(store);
        store.dispatch(removeNodeByKeys([lastNameNode]));
      } else {
        const nodeName = dependentMount.getNameNode();
        const availableNameNodes = defaultMountElement.getAvailableNameNode();
        const notActiveNameNodes = getNotActiveNodes(availableNameNodes)(store);
        const lastNotActiveNameNode =
          notActiveNameNodes[notActiveNameNodes.length - 1];
        if (notActiveNameNodes.length) {
          const keysActiveChange = Object.keys(element.getAutoChangeItems());
          const keyAutoChangeItem = keysActiveChange[0];
          if (keyAutoChangeItem) {
            const isSelectElement = getIsSelectedCardByKeyPermission(
              stepName,
              keyAutoChangeItem
            )(state);
            if (isSelectElement) {
              const elementActiveChange =
                step.getElementByName(keyAutoChangeItem);
              if (!(elementActiveChange instanceof ItemElement)) return;
              const mountElementActiveChange =
                elementActiveChange.getDefaultMount();
              if (!(mountElementActiveChange instanceof ReferenceMountElement))
                return;
              const cardActiveChange = getCardByKeyPermission(
                stepName,
                keyAutoChangeItem
              )(state);
              const cardAssetActiveChange =
                getAssetFromCard(cardActiveChange)(state);
              setElementByNameNode(
                cardAssetActiveChange.id,
                lastNotActiveNameNode
              )(store);
              setElementByNameNode(
                cardAssetElement.id,
                mountElementActiveChange.getNameNode()
              )(store);
              store.dispatch(removeNodeByKeys([nodeName]));
              if (value === 0) {
                removeElement();
              }
              return;
            }
          }
        }
        setElementByNameNode(cardAssetElement.id, lastNotActiveNameNode)(store);
        store.dispatch(removeNodeByKeys([nodeName]));
        if (value === 0) {
          removeElement();
        }
      }
    }
    if (!(mountElement instanceof CountableMountElement)) return;

    mountElement.setActiveIndex(prevValue);

    const autoChangeItems = element.getAutoChangeItems();
    const isChangeAutoItems = !!Object.keys(autoChangeItems).length;
    if (isIncrease) {
      const nodeName = mountElement.next().getNameNode();
      if (isChangeAutoItems) {
        Object.entries(autoChangeItems).forEach(([key, arr]) => {
          if (!arr.includes("count")) return;
          const isSelectElement = getIsSelectedCardByKeyPermission(
            stepName,
            key
          )(state);
          if (!isSelectElement) {
            setElementByNameNode(cardAsset.id, nodeName)(store);
            return;
          }
          const element = step.getElementByName(key);
          if (!(element instanceof ItemElement)) return;
          const defaultMount = element.getDefaultMount();
          if (!(defaultMount instanceof ReferenceMountElement)) return;

          const cardElement = getCardByKeyPermission(stepName, key)(state);
          const cardAssetElement = getAssetFromCard(cardElement)(state);

          const dependentMount = defaultMount.getDependentMount();
          if (!dependentMount) {
            setElementByNameNode(cardAssetElement.id, nodeName)(store);
            setElementByNameNode(
              cardAsset.id,
              defaultMount.getNameNode()
            )(store);
          }
        });
      } else {
        setElementByNameNode(cardAsset.id, nodeName)(store);
      }
    } else {
      const nodeName = mountElement.getNameNode();
      store.dispatch(removeNodeByKeys([nodeName]));
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

function updateAssetIdNodeNames(namesNode: Array<string>, assetId: string) {
  return (store: Store) => {
    const state = store.getState();
    namesNode.forEach((name) => {
      const isExist = !!getAssetIdByNameNode(name)(state);
      if (!isExist) return;
      setElementByNameNode(assetId, name)(store);
    });
  };
}

function setAssetIdNodeNames(namesNode: Array<string>, assetId: string) {
  return (store: Store) => {
    namesNode.forEach((name) => {
      setElementByNameNode(assetId, name)(store);
    });
  };
}

function getActiveNameNodes(nameNodes: Array<string>) {
  return (store: Store) => {
    const state = store.getState();
    const nodes = getNodes(state);
    return nameNodes.filter((name) => !!nodes[name]);
  };
}

function getNotActiveNodes(nameNodes: Array<string>) {
  return (store: Store) => {
    const state = store.getState();
    const nodes = getNodes(state);
    return nameNodes.filter((name) => !nodes[name]);
  };
}
