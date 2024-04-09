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
          activeStep,
          dependentMount.name
        )(state);
        const cardAssetReference = getAssetFromCard(cardReference)(state);

        const autoChangeItems = element.getAutoChangeItems();
        const keyAutoChange = Object.keys(autoChangeItems)[0];
        const selectAutoChange = getIsSelectedCardByKeyPermission(
          activeStep,
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
            activeStep,
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

    if (element instanceof MountElement && value === 0) {
      const nameProperty = card.dataThreekit.attributeName;
      app.removeItem(nameProperty, card.keyPermission);
    }

    if (!element || !(element instanceof ItemElement)) return;

    const mountElement = element.getDefaultMount();

    if (!mountElement) return;

    const removeElement = () => {
      store.dispatch(removeNodes(cardAsset.id));
      const nameProperty = card.dataThreekit.attributeName;
      app.removeItem(nameProperty, card.keyPermission);
    };

    if (!(mountElement instanceof CountableMountElement)) return;

    mountElement.setActiveIndex(prevValue);

    const autoChangeItems = element.getAutoChangeItems();
    const isChangeAutoItems = !!Object.keys(autoChangeItems).length;
    if (isIncrease) {
      const nodeName = mountElement.next().getNameNode();
      if (isChangeAutoItems) {
        const activeAutoItemArr = Object.entries(autoChangeItems)
          .filter(([key, arr]) => {
            if (!arr.includes("count")) return false;
            return getIsSelectedCardByKeyPermission(stepName, key)(state);
          })
          .map(([key]) => key);
        const allActive =
          activeAutoItemArr.length === Object.keys(autoChangeItems).length;
        const dependentMount = mountElement.getDependentMount();
        if (!dependentMount) {
          const isOneActive = !allActive && activeAutoItemArr.length === 1;
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
            setElementByNameNode(cardAssetElement.id, lastNode)(store);
            setElementByNameNode(
              cardAsset.id,
              dependentMount.getNameNode()
            )(store);
          } else if (allActive) {
            // activeAutoItemArr.forEach((key) => {
            //   const element = step.getElementByName(key);
            //   if (!(element instanceof ItemElement)) return;
            //   const defaultMount = element.getDefaultMount();
            //   if (!(defaultMount instanceof CountableMountElement)) return;
            //   const dependentMount = defaultMount.getDependentMount();
            //   if (!(dependentMount instanceof ReferenceMountElement)) return;
            //   const notActiveNodes = getNotActiveNodes([
            //     ...defaultMount.getAvailableNameNode(),
            //   ])(store);
            //   if (!notActiveNodes.length) return;
            //   const [nameNode] = notActiveNodes;
            //   const cardElement = getCardByKeyPermission(stepName, key)(state);
            //   const cardAssetElement = getAssetFromCard(cardElement)(state);
            //   setElementByNameNode(cardAssetElement.id, nameNode)(store);
            //   setElementByNameNode(
            //     cardAsset.id,
            //     dependentMount.getNameNode()
            //   )(store);
            // });
          } else {
            setElementByNameNode(cardAsset.id, nodeName)(store);
          }
        } else {
          if (!(dependentMount instanceof ReferenceMountElement)) return;

          Object.entries(autoChangeItems).forEach(([key, arr]) => {
            if (!arr.includes("count")) return;
            const element = step.getElementByName(key);
            if (!(element instanceof ItemElement)) return;
            const defaultMount = element.getDefaultMount();
            if (!(defaultMount instanceof CountableMountElement)) return;
            defaultMount.next();
            const nameNode = defaultMount.getNameNode();
            store.dispatch(removeNodeByKeys([nameNode]));
          });

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
        }
      } else {
        setElementByNameNode(cardAsset.id, nodeName)(store);
      }
    } else {
      if (isChangeAutoItems) {
        const activeAutoItemArr = Object.entries(autoChangeItems)
          .filter(([key, arr]) => {
            if (!arr.includes("count")) return false;
            return getIsSelectedCardByKeyPermission(stepName, key)(state);
          })
          .map(([key]) => key);
        const allActive =
          activeAutoItemArr.length === Object.keys(autoChangeItems).length;
        const dependentMount = mountElement.getDependentMount();
        if (!dependentMount) {
          const isOneActive = !allActive && activeAutoItemArr.length === 1;
          if (isOneActive) {
            const [key] = activeAutoItemArr;
            const element = step.getElementByName(key);
            if (!(element instanceof ItemElement)) return;
            const defaultMount = element.getDefaultMount();
            if (!(defaultMount instanceof CountableMountElement)) return;
            const dependentMount = defaultMount.getDependentMount();
            if (!(dependentMount instanceof ReferenceMountElement)) return;

            defaultMount.next();
            const nodeName = defaultMount.getNameNode();
            store.dispatch(removeNodeByKeys([nodeName]));
          } else if (allActive) {
            // activeAutoItemArr.forEach((key) => {
            //   const element = step.getElementByName(key);
            //   if (!(element instanceof ItemElement)) return;
            //   const defaultMount = element.getDefaultMount();
            //   if (!(defaultMount instanceof CountableMountElement)) return;
            //   const dependentMount = defaultMount.getDependentMount();
            //   if (!(dependentMount instanceof ReferenceMountElement)) return;
            //   const activeNodes = getActiveNameNodes([
            //     ...defaultMount.getRangeNameNode(),
            //   ])(store);
            //   const availableNameNodes = defaultMount.getAvailableNameNode();
            //   const notActiveNodes = activeNodes.filter(
            //     (name) => !availableNameNodes.includes(name)
            //   );
            //   if (!notActiveNodes.length) return;
            //   notActiveNodes.forEach((nameNode) => {
            //     store.dispatch(removeNodeByKeys([nameNode]));
            //   });
            // });
          } else {
            const nodeName = mountElement.getNameNode();
            store.dispatch(removeNodeByKeys([nodeName]));
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
          });

          const nodeName = mountElement.getNameNode();
          store.dispatch(removeNodeByKeys([nodeName]));
        }
      } else {
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
