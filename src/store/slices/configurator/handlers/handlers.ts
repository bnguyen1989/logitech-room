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
import { MountElement } from "../../../../models/permission/elements/MountElement";
import { CountableMountElement } from "../../../../models/permission/elements/CountableMountElement";
import { removeActiveCard } from "../../ui/Ui.slice";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getDataStepByName,
  getPermission,
} from "../../ui/selectors/selectors";

export function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const state = store.getState();
    const configuration = configurator.getConfiguration();
    const step = store.getState().ui.stepData[stepName];
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
        defaultMount.setMin(card.counter.min);
        defaultMount.setMax(card.counter.max);
        defaultMount.setActiveIndex(0);
        const nodeName = defaultMount.next().getNameNode();

        const dependentMount = defaultMount.getDependentMount();
        if (dependentMount) {
          const elementDependent = step.getElementByName(dependentMount.name);
          if (elementDependent instanceof ItemElement) {
            const mountElementDependent = elementDependent.getDefaultMount();
            if (mountElementDependent) {
              const nodes = store.getState().configurator.nodes;
              const assetId = nodes[mountElementDependent.getNameNode()];
              setElementByNameNode(cardAsset.id, nodeName)(store);
              setElementByNameNode(
                assetId,
                dependentMount.getNameNode()
              )(store);
            }
          }
        } else {
          setElementByNameNode(cardAsset.id, nodeName)(store);
        }
      } else if (defaultMount instanceof MountElement) {
        const dependentMount = defaultMount.getDependentMount();
        if (dependentMount) {
          const nodes = store.getState().configurator.nodes;
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
    const stepData = getDataStepByName(activeStep)(state);
    const permission = getPermission(activeStep)(state);

    if (!card) return;

    const cardAsset = getAssetFromCard(card)(state);

    const element = permission
      .getCurrentStep()
      ?.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        const dependentMount = mountElement.getDependentMount();
        if (dependentMount) {
          const names = mountElement.getRangeNameNode();
          const nodes = state.configurator.nodes;
          const assetIdDependentMount = nodes[dependentMount.getNameNode()];
          store.dispatch(removeNodes(assetIdDependentMount));
          names.forEach((name) => {
            if (nodes[name]) {
              store.dispatch(removeNodes(nodes[name]));
              setElementByNameNode(assetIdDependentMount, name)(store);
            }
          });
        }

        mountElement.setActiveIndex(0);
      }
    }
    if (element instanceof MountElement) {
      const itemElement = permission
        .getCurrentStep()
        ?.getActiveItemElementByMountName(element.name);
      if (itemElement instanceof ItemElement) {
        const defaultMount = itemElement.getDefaultMount();
        const cardItemElement = stepData.cards[itemElement.name];
        const cardItemElementAsset = getAssetFromCard(cardItemElement)(state);
        if (defaultMount && cardItemElement) {
          const dependentMount = defaultMount.getDependentMount();
          if (dependentMount) {
            store.dispatch(changeStatusProcessing(true));
            const dependentCard = stepData.cards[dependentMount.name];
            const dependentCardAsset = getAssetFromCard(dependentCard)(state);
            if (dependentCard) {
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
    if (!mountElement || !(mountElement instanceof CountableMountElement))
      return;

    mountElement.setActiveIndex(prevValue);
    mountElement.setMin(card.counter.min);
    mountElement.setMax(card.counter.max);

    if (isIncrease) {
      const nodeName = mountElement.next().getNameNode();
      const dependentMount = mountElement.getDependentMount();
      if (dependentMount) {
        const nodes = state.configurator.nodes;
        const assetId = nodes[nodeName];
        if (assetId) {
          setElementByNameNode(cardAsset.id, nodeName)(store);
          setElementByNameNode(assetId, dependentMount.getNameNode())(store);
        }
      } else {
        setElementByNameNode(cardAsset.id, nodeName)(store);
      }
    } else {
      const prevNodeName = mountElement.getNameNode();
      mountElement.prev();
      const dependentMount = mountElement.getDependentMount();
      if (dependentMount) {
        const nodes = store.getState().configurator.nodes;
        const assetId = nodes[dependentMount.getNameNode()];
        if (assetId) {
          setElementByNameNode(assetId, prevNodeName)(store);
        }
      }

      const nodes = store.getState().configurator.nodes;
      const keysNode = Object.keys(nodes).filter(
        (key) => nodes[key] === cardAsset.id
      );
      if (keysNode.length > value) {
        const deleteKeys = keysNode.slice(value);
        store.dispatch(removeNodeByKeys(deleteKeys));
      }
    }

    if (value === 0) {
      const dependentMount = mountElement.getDependentMount();
      if (dependentMount) {
        const nodeName = mountElement.getNameNode();
        const nodes = store.getState().configurator.nodes;
        const assetId = nodes[dependentMount.getNameNode()];
        if (assetId) {
          setElementByNameNode(assetId, nodeName)(store);
        }
      }
      store.dispatch(removeNodes(cardAsset.id));
      store.dispatch(removeActiveCard({ key: card.keyPermission }));
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
