import { Middleware } from "@reduxjs/toolkit";
import { updateDataCardByStepName } from "../slices/ui/handlers/handlers";
import { Application } from "../../models/Application";
import {
  addElement,
  removeElement,
  updateNodesByConfiguration,
} from "../slices/configurator/handlers/handlers";
import { Permission } from "../../models/permission/Permission";
import {
  getActiveStep,
  getCardByKeyPermission,
  getKeyActiveCards,
} from "../slices/ui/selectors/selectors";
import { Configurator } from "../../models/configurator/Configurator";
import { addActiveCards, removeActiveCards } from "../slices/ui/Ui.slice";

declare const app: Application;

export const middleware: Middleware =
  (store: any) => (next) => async (action: any) => {
    const state = store.getState();
    const currentConfigurator = app.currentConfigurator;

    switch (action.type) {
      case "ui/addActiveCard": {
        const { key } = action.payload;
        const activeKeys = getKeyActiveCards(state);
        const activeStep = getActiveStep(state);

        const permission = new Permission(activeKeys, activeStep);

        if (!permission.canAddActiveElementByName(key)) return;

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
      case "ui/removeActiveCard": {
        const { key } = action.payload;
        const activeKeys = getKeyActiveCards(state);
        const activeStep = getActiveStep(state);

        const permission = new Permission(activeKeys, activeStep);

        if (!permission.canRemoveActiveElementByName(key)) return;

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
      case "ui/changeActiveStep": {
        const stepName = action.payload;
        updateDataCardByStepName(stepName)(store, currentConfigurator);
        break;
      }
      default:
        break;
    }

    const res = next(action);

    switch (action.type) {
      case "ui/addActiveCard": {
        const { key } = action.payload;
        const activeKeys = getKeyActiveCards(state);
        const activeStep = getActiveStep(state);

        const permission = new Permission([...activeKeys, key], activeStep);
        permission.addActiveElementByName(key);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const card = getCardByKeyPermission(activeStep, key)(state);
        addElement(card, activeStep)(store);

        console.log("Middleware triggered: ui/addActiveCard");
        break;
      }

      case "ui/removeActiveCard": {
        const { key } = action.payload;
        const activeKeys = getKeyActiveCards(state);
        const activeStep = getActiveStep(state);

        const permission = new Permission(activeKeys, activeStep);
        permission.removeActiveElementByName(key);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const card = getCardByKeyPermission(activeStep, key)(state);
        removeElement(card)(store);

        console.log("Middleware triggered: ui/removeActiveCard");
        break;
      }

      case "ui/changeActiveStep": {
        const stepName = action.payload;
        const activeKeys = getKeyActiveCards(state);
        const activeStep = getActiveStep(state);

        const permission = new Permission(activeKeys, activeStep);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const updateNodes = updateNodesByConfiguration(
          currentConfigurator,
          stepName
        );

        const attributeNames = Configurator.getNamesAttrByStepName(stepName);
        updateNodes(store, attributeNames);
        break;
      }
      default:
        break;
    }
    return res;
  };
