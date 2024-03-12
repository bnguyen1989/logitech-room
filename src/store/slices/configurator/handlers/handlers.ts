import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { CardI, StepI } from "../../ui/type";
import {
  changeStatusProcessing,
  changeValueNodes,
  removeNodeByKeys,
  removeNodes,
} from "../Configurator.slice";
import { Configurator } from "../../../../models/configurator/Configurator";
import { RemoveItemCommand } from "../../../../models/command/RemoveItemCommand";
import { Permission } from "../../../../models/permission/Permission";
import { ChangeCountItemCommand } from "../../../../models/command/ChangeCountItemCommand";
import { StepName } from "../../../../models/permission/type";
import { ChangeStepCommand } from "../../../../models/command/ChangeStepCommand";
import { ItemElement } from "../../../../models/permission/elements/ItemElement";
import { MountElement } from "../../../../models/permission/elements/MountElement";
import { CountableMountElement } from "../../../../models/permission/elements/CountableMountElement";
import { removeActiveCard } from "../../ui/Ui.slice";
import { getActiveStep, getDataStepByName } from "../../ui/selectors/selectors";

declare const app: Application;
declare const permission: Permission;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = getActiveStep(store.getState());
      const stepData = getDataStepByName(activeStep)(store.getState());
      const card = stepData.cards[data.keyItemPermission];
      addElement(card, stepData)(store);
    }

    if (data instanceof RemoveItemCommand) {
      const activeStep = getActiveStep(store.getState());
      const stepData = getDataStepByName(activeStep)(store.getState());
      const card = stepData.cards[data.keyItemPermission];
      removeElement(card)(store);
    }

    if (data instanceof ChangeCountItemCommand) {
      const activeStep = getActiveStep(store.getState());
      const stepData = getDataStepByName(activeStep)(store.getState());
      const card = stepData.cards[data.keyItemPermission];
      const value = parseInt(data.value);
      changeCountElement(card, value, data.isIncrease)(store);
    }

    if (data instanceof ChangeStepCommand) {
      const configurator = app.currentConfigurator;
      const updateNodes = updateNodesByConfiguration(
        configurator,
        data.stepName
      );

      if (data.stepName === StepName.Platform) {
        updateNodes(store, Configurator.PlatformName);
      }
      if (data.stepName === StepName.Services) {
        updateNodes(store, Configurator.ServicesName);
      }
      if (data.stepName === StepName.AudioExtensions) {
        updateNodes(store, Configurator.AudioExtensionName);
      }
      if (data.stepName === StepName.ConferenceCamera) {
        updateNodes(store, Configurator.CameraName);
      }
      if (data.stepName === StepName.MeetingController) {
        updateNodes(store, Configurator.MeetingControllerName);
      }
      if (data.stepName === StepName.VideoAccessories) {
        updateNodes(store, Configurator.VideoAccessoriesName);
      }
    }
  });
};

function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const configuration = configurator.getConfiguration();
    const step = store.getState().ui.stepData[stepName];
    arrayAttributes.forEach((item) => {
      const [name] = item;
      const value = configuration[name];

      if (!(typeof value === "object")) return;

      if (value.assetId.length) {
        const card: CardI | undefined = findCard(
          (card) => card.threekit?.assetId === value.assetId,
          Object.values(step.cards)
        );
        if (!card) return;
        addElement(card, step)(store);
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

function addElement(card: CardI, stateStep: StepI) {
  return (store: Store) => {
    const step = permission.getCurrentStep();
    if (!card || !card.threekit || !step) return;

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();

      if (defaultMount instanceof CountableMountElement) {
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
              setElementByNameNode(card.threekit.assetId, nodeName)(store);
              setElementByNameNode(
                assetId,
                dependentMount.getNameNode()
              )(store);
            }
          }
        } else {
          setElementByNameNode(card.threekit.assetId, nodeName)(store);
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
            setElementByNameNode(
              card.threekit.assetId,
              existDependentMountName
            )(store);
          } else {
            store.dispatch(changeStatusProcessing(true));
            const dependentCard = stateStep.cards[dependentMount.name];
            if (dependentCard && dependentCard.threekit) {
              const value = nodes[defaultMount.getNameNode()];
              if (value !== dependentCard.threekit.assetId)
                setElementByNameNode(
                  dependentCard.threekit.assetId,
                  defaultMount.getNameNode()
                )(store);
              setElementByNameNode(
                card.threekit.assetId,
                dependentMount.getNameNode()
              )(store);
            }
          }
        } else {
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(
            card.threekit.assetId,
            defaultMount.getNameNode()
          )(store);
        }
      }
    } else if (element instanceof MountElement) {
      const itemElement = step.getActiveItemElementByMountName(element.name);
      if (!itemElement) return;
      const cardItemElement = stateStep.cards[itemElement.name];
      if (cardItemElement && cardItemElement.threekit) {
        const dependentMount = element.getDependentMount();
        if (dependentMount) {
          const keysForRemove =
            itemElement
              ?.getDependenceMount()
              .map((mount) => mount.getNameNode()) || [];
          store.dispatch(removeNodes(cardItemElement.threekit.assetId));
          store.dispatch(removeNodeByKeys(keysForRemove));
          store.dispatch(changeStatusProcessing(true));
          const dependentCard = stateStep.cards[dependentMount.name];
          if (dependentCard && dependentCard.threekit) {
            setElementByNameNode(
              dependentCard.threekit.assetId,
              element.getNameNode()
            )(store);
            setElementByNameNode(
              cardItemElement.threekit.assetId,
              dependentMount.getNameNode()
            )(store);
          }
        } else {
          store.dispatch(changeStatusProcessing(true));
          store.dispatch(removeNodes(cardItemElement.threekit.assetId));
          store.dispatch(removeNodes(card.threekit.assetId));
          setElementByNameNode(
            cardItemElement.threekit.assetId,
            element.getNameNode()
          )(store);
        }
      }
    }
  };
}

function removeElement(card: CardI) {
  return (store: Store) => {
    const activeStep = getActiveStep(store.getState());
    const stepData = getDataStepByName(activeStep)(store.getState());

    if (!card.threekit) return;

    permission.removeActiveItemByName(card.keyPermission);

    const element = permission
      .getCurrentStep()
      ?.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        const dependentMount = mountElement.getDependentMount();
        if (dependentMount) {
          const names = mountElement.getRangeNameNode();
          const nodes = store.getState().configurator.nodes;
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
        if (defaultMount && cardItemElement && cardItemElement.threekit) {
          const dependentMount = defaultMount.getDependentMount();
          if (dependentMount) {
            store.dispatch(changeStatusProcessing(true));
            const dependentCard = stepData.cards[dependentMount.name];
            if (dependentCard && dependentCard.threekit) {
              setElementByNameNode(
                dependentCard.threekit.assetId,
                defaultMount.getNameNode()
              )(store);
              setElementByNameNode(
                cardItemElement.threekit.assetId,
                dependentMount.getNameNode()
              )(store);
            }
          } else {
            store.dispatch(removeNodes(cardItemElement.threekit.assetId));
            store.dispatch(changeStatusProcessing(true));
            setElementByNameNode(
              cardItemElement.threekit.assetId,
              defaultMount.nodeName
            )(store);
          }
        }
      }
    }

    store.dispatch(removeNodes(card.threekit.assetId));
  };
}

function changeCountElement(card: CardI, value: number, isIncrease: boolean) {
  return (store: Store) => {
    const step = permission.getCurrentStep();
    if (!card || !card.threekit || !step) return;

    const element = step.getElementByName(card.keyPermission);
    if (element instanceof ItemElement) {
      const mountElement = element.getDefaultMount();
      if (mountElement instanceof CountableMountElement) {
        if (isIncrease) {
          const nodeName = mountElement.next().getNameNode();
          const dependentMount = mountElement.getDependentMount();
          if (dependentMount) {
            const nodes = store.getState().configurator.nodes;
            const assetId = nodes[nodeName];
            if (assetId) {
              setElementByNameNode(card.threekit.assetId, nodeName)(store);
              setElementByNameNode(
                assetId,
                dependentMount.getNameNode()
              )(store);
            }
          } else {
            setElementByNameNode(card.threekit.assetId, nodeName)(store);
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
            (key) => card.threekit && nodes[key] === card.threekit.assetId
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
          permission.removeActiveItemByName(card.keyPermission);
          store.dispatch(removeNodes(card.threekit.assetId));
          store.dispatch(removeActiveCard({ key: card.keyPermission }));
        }
      }
    }
  };
}

function findCard(
  callback: (card: CardI) => boolean,
  cards: Array<CardI>
): Required<CardI> | undefined {
  const card = cards.find((card: CardI) => callback(card));

  if (!card || !card.keyPermission || !card.threekit) return;
  return card as Required<CardI>;
}
