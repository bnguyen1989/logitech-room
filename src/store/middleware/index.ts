import { Middleware } from "@reduxjs/toolkit";
import { updateDataCardByStepName } from "../slices/ui/handlers/handlers";
import { Application } from "../../models/Application";
import {
  addElement,
  removeElement,
  updateNodesByConfiguration,
} from "../slices/configurator/handlers/handlers";
import {
  getActiveStep,
  getCardByKeyPermission,
  getPermission,
} from "../slices/ui/selectors/selectors";
import { Configurator } from "../../models/configurator/Configurator";
import { addActiveCards, removeActiveCards } from "../slices/ui/Ui.slice";

declare const app: Application;

export const middleware: Middleware =
  (store: any) => (next) => async (action: any) => {
    let state = store.getState();
    const currentConfigurator = app.currentConfigurator;

    switch (action.type) {
      case "ui/addActiveCard": {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);

        if (!permission.canAddActiveElementByName(key)) return;

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
      case "ui/removeActiveCard": {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);

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
    state = store.getState();

    switch (action.type) {
      case "ui/addActiveCard": {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);
        permission.processAddActiveElementByName(key);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const card = getCardByKeyPermission(activeStep, key)(state);
        addElement(card, activeStep)(store);
        break;
      }

      case "ui/removeActiveCard": {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);
        permission.processRemoveActiveElementByName(key);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const card = getCardByKeyPermission(activeStep, key)(state);
        removeElement(card)(store);
        break;
      }

      case "ui/changeActiveStep": {
        const stepName = action.payload;

        const permission = getPermission(stepName)(state);

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
