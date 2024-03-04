import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from "../../../../models/command/AddItemCommand";
import { BaseCardI, ItemCardI, StepCardType, StepI } from "../../ui/type";
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

declare const app: Application;
declare const permission: Permission;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (!activeStep) return;
      addElement(data.assetId, activeStep)(store);
    }

    if (data instanceof RemoveItemCommand) {
      removeElement(data.assetId)(store);
    }

    if (data instanceof ChangeCountItemCommand) {
      const activeStep = store.getState().ui.activeStep;
      if (!activeStep) return;
      const value = parseInt(data.value);
      changeCountElement(
        data.assetId,
        value,
        data.isIncrease,
        activeStep
      )(store);
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
        addElement(value.assetId, step)(store);
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

function addElement(assetId: string, stateStep: StepI<StepCardType>) {
  return (store: Store) => {
    const card: BaseCardI | undefined = stateStep.cards.find(
      (card: BaseCardI) => card.threekit?.assetId === assetId
    );

    if (!card || !card.keyPermission) return;
    const step = permission.getCurrentStep();

    if (!step || !card.threekit) return;

    const element = step.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      if (defaultMount && card.threekit) {
        store.dispatch(changeStatusProcessing(true));
        setElementByNameNode(
          card.threekit.assetId,
          defaultMount.getNameNode()
        )(store);
      }
      const [mountElement] = element.getDependenceMount();
      if (mountElement instanceof CountableMountElement) {
        mountElement.setActiveIndex(0);
        const nodeName = mountElement.next().getNameNode();
        setElementByNameNode(card.threekit.assetId, nodeName)(store);
      }
    } else if (element instanceof MountElement) {
      const itemElement = step.getActiveItemElementByMountName(element.name);
      const cardItemElement = stateStep.cards.find(
        (card) => card.keyPermission === itemElement?.name
      );
      if (cardItemElement && cardItemElement.threekit) {
        store.dispatch(removeNodes(cardItemElement.threekit.assetId));
        store.dispatch(changeStatusProcessing(true));
        setElementByNameNode(
          cardItemElement.threekit.assetId,
          element.getNameNode()
        )(store);
      }
    }
  };
}

function removeElement(assetId: string) {
  return (store: Store) => {
    const activeStep = store.getState().ui.activeStep;
    if (!activeStep) return;
    const index = activeStep.cards.findIndex(
      (item: ItemCardI) => item.threekit?.assetId === assetId
    );
    if (index === -1) return;

    const card = activeStep.cards[index];
    permission.removeActiveItemByName(card.keyPermission);

    const element = permission
      .getCurrentStep()
      ?.getElementByName(card.keyPermission);

    if (element instanceof ItemElement) {
      const [mountElement] = element.getDependenceMount();
      if (mountElement instanceof CountableMountElement) {
        mountElement.setActiveIndex(0);
      }
    }
    if (element instanceof MountElement) {
      const itemElement = permission
        .getCurrentStep()
        ?.getActiveItemElementByMountName(element.name);
      if (itemElement instanceof ItemElement) {
        const defaultMount = itemElement.getDefaultMount();
        const cardItemElement = activeStep.cards.find(
          (card: ItemCardI) => card.keyPermission === itemElement?.name
        );
        if (defaultMount && cardItemElement && cardItemElement.threekit) {
          store.dispatch(removeNodes(cardItemElement.threekit.assetId));
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(
            cardItemElement.threekit.assetId,
            defaultMount.nodeName
          )(store);
        }
      }
    }

    store.dispatch(removeNodes(assetId));
  };
}

function changeCountElement(
  assetId: string,
  value: number,
  isIncrease: boolean,
  stateStep: StepI<StepCardType>
) {
  return (store: Store) => {
    const card: BaseCardI | undefined = stateStep.cards.find(
      (card: BaseCardI) => card.threekit?.assetId === assetId
    );

    if (!card || !card.keyPermission) return;
    const step = permission.getCurrentStep();

    if (!step || !card.threekit) return;

    const element = step.getElementByName(card.keyPermission);
    if (element instanceof ItemElement) {
      const [mountElement] = element.getDependenceMount();
      if (mountElement instanceof CountableMountElement) {
        if (isIncrease) {
          const nodeName = mountElement.next().getNameNode();
          setElementByNameNode(card.threekit.assetId, nodeName)(store);
        } else {
          const nodeName = mountElement.prev().getNameNode();
          setElementByNameNode(card.threekit.assetId, nodeName)(store);

          const nodes = store.getState().configurator.nodes;
          const keysNode = Object.keys(nodes).filter(
            (key) => nodes[key] === assetId
          );
          if (keysNode.length > value) {
            const deleteKeys = keysNode.slice(value);
            store.dispatch(removeNodeByKeys(deleteKeys));
          }
        }

        if (value === 0) {
          permission.removeActiveItemByName(card.keyPermission);
          store.dispatch(removeNodes(assetId));
          store.dispatch(removeActiveCard(card as StepCardType));
        }
      }
    }
  };
}
