import { Middleware } from "@reduxjs/toolkit";
import { updateDataCardByStepName } from "../slices/ui/handlers/handlers";
import { Application } from "../../models/Application";
import {
  changeColorElement,
  changeCountElement,
  removeElement,
  updateNodesByConfiguration,
} from "../slices/configurator/handlers/handlers";
import {
  getActiveStep,
  getCardByKeyPermission,
  getPermission,
  getPropertyCounterCardByKeyPermission,
} from "../slices/ui/selectors/selectors";
import { Configurator } from "../../models/configurator/Configurator";
import {
  addActiveCard,
  addActiveCards,
  removeActiveCard,
  removeActiveCards,
  setPropertyItem,
} from "../slices/ui/Ui.slice";
import { CUSTOM_UI_ACTION_NAME, UI_ACTION_NAME } from "../slices/ui/utils";

declare const app: Application;

export const middleware: Middleware =
  (store: any) => (next) => async (action: any) => {
    let state = store.getState();
    const currentConfigurator = app.currentConfigurator;

    switch (action.type) {
      case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);

        if (!permission.canAddActiveElementByName(key)) return;

        const card = getCardByKeyPermission(activeStep, key)(state);
        if (card?.counter && card.counter.max === 0) return;

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
      case UI_ACTION_NAME.REMOVE_ACTIVE_CARD: {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);

        if (!permission.canRemoveActiveElementByName(key)) return;

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
      case UI_ACTION_NAME.CHANGE_ACTIVE_STEP: {
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
      case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);

        permission.processAddActiveElementByName(key);

        store.dispatch(addActiveCards({ keys: permission.getAddKeys() }));
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        const updateNodes = updateNodesByConfiguration(
          currentConfigurator,
          activeStep
        );

        const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
        updateNodes(store, attributeNames);
        break;
      }

      case UI_ACTION_NAME.REMOVE_ACTIVE_CARD: {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);
        permission.processRemoveActiveElementByName(key);

        permission.getAddKeys().forEach((key) => {
          store.dispatch(addActiveCard({ key }));
        });

        permission.getRemoveKeys().forEach((key) => {
          store.dispatch(removeActiveCard({ key }));
        });

        const card = getCardByKeyPermission(activeStep, key)(state);
        removeElement(card)(store);
        break;
      }

      case UI_ACTION_NAME.CHANGE_ACTIVE_STEP: {
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

      case CUSTOM_UI_ACTION_NAME.CHANGE_COUNT_ITEM: {
        const { key, value } = action.payload;
        const activeStep = getActiveStep(state);
        const prevCount = getPropertyCounterCardByKeyPermission(
          activeStep,
          key
        )(state);
        if (prevCount === undefined) return;

        const permission = getPermission(activeStep)(state);
        Object.entries(permission.getItemsNeedChange(key)).forEach(
          ([key, arr]) => {
            const count = arr.includes("count");
            if (!count) return;
            store.dispatch(
              setPropertyItem({
                step: activeStep,
                keyItemPermission: key,
                property: {
                  count: value,
                },
              })
            );
          }
        );

        updateDataCardByStepName(activeStep)(store, currentConfigurator);

        store.dispatch(
          setPropertyItem({
            step: activeStep,
            keyItemPermission: key,
            property: {
              count: value,
            },
          })
        );

        changeCountElement(key, activeStep, value, prevCount)(store);
        break;
      }

      case CUSTOM_UI_ACTION_NAME.CHANGE_COLOR_ITEM: {
        const { key, value } = action.payload;
        const activeStep = getActiveStep(state);

        store.dispatch(
          setPropertyItem({
            step: activeStep,
            keyItemPermission: key,
            property: {
              color: value,
            },
          })
        );

        const permission = getPermission(activeStep)(state);
        permission.processChangeColorElementByName(key);

        Object.entries(permission.getItemsNeedChange(key)).forEach(
          ([key, arr]) => {
            const color = arr.includes("color");
            if (!color) return;
            store.dispatch(
              setPropertyItem({
                step: activeStep,
                keyItemPermission: key,
                property: {
                  color: value,
                },
              })
            );
          }
        );

        store.dispatch(
          addActiveCards({ keys: [...permission.getAddKeys(), key] })
        );
        store.dispatch(removeActiveCards({ keys: permission.getRemoveKeys() }));

        changeColorElement(key, activeStep)(store);
        break;
      }
      default:
        break;
    }
    return res;
  };
