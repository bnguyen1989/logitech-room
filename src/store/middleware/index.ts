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
} from "../slices/ui/selectors/selectors";
import { Configurator } from '../../models/configurator/Configurator'

declare const app: Application;
declare const permission: Permission;

export const middleware: Middleware =
  (store: any) => (next) => async (action: any) => {
    const state = store.getState();
    const currentConfigurator = app.currentConfigurator;

    switch (action.type) {
      case "ui/changeActiveStep": {
        const stepName = action.payload;
        permission.changeStepName(stepName);
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
        permission.addActiveElementByName(key);

        const activeStep = getActiveStep(state);
        updateDataCardByStepName(activeStep)(store, currentConfigurator);

        const card = getCardByKeyPermission(activeStep, key)(state);
        addElement(card, activeStep)(store);

        console.log("Middleware triggered: ui/addActiveCard");
        break;
      }

      case "ui/removeActiveCard": {
        const { key } = action.payload;
        permission.removeActiveItemByName(key);

        const activeStep = getActiveStep(state);
        updateDataCardByStepName(activeStep)(store, currentConfigurator);

        const card = getCardByKeyPermission(activeStep, key)(state);
        removeElement(card)(store);

        console.log("Middleware triggered: ui/removeActiveCard");
        break;
      }

			case "ui/changeActiveStep": {
				const stepName = action.payload;
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
