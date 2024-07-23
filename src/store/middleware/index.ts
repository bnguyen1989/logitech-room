import { Middleware } from "@reduxjs/toolkit";
import {
  updateActiveCardsByPermissionData,
  updateAssetIdByKeyPermission,
  updateDataCardByStepName,
} from "../slices/ui/handlers/handlers";
import { Application } from "../../models/Application";
import {
  changeColorElement,
  changeCountElement,
  deleteNodesByCards,
  removeElement,
  setDefaultsNode,
  updateHighlightNodes,
  updateNodesByConfiguration,
} from "../slices/configurator/handlers/handlers";
import {
  getActiveStep,
  getCardByKeyPermission,
  getCardsByStep,
  getDataStepByName,
  getPermission,
  getPositionStepNameBasedOnActiveStep,
  getPrevNextStepByStepName,
  getPropertyCounterCardByKeyPermission,
  getStepNameByKeyPermission,
} from "../slices/ui/selectors/selectors";
import { Configurator } from "../../models/configurator/Configurator";
import {
  addActiveCard,
  changeActiveStep,
  clearAllActiveCardsSteps,
  setPropertyItem,
} from "../slices/ui/Ui.slice";
import { CUSTOM_UI_ACTION_NAME, UI_ACTION_NAME } from "../slices/ui/utils";
import { getAutoChangeDataByKeyPermission } from "../slices/ui/selectors/selectorsPermission";
import {
  StepName,
  getArrayStepNames,
  getPrepareStepNames,
} from "../../utils/baseUtils";
import { CONFIGURATOR_ACTION_NAME } from "../slices/configurator/utils";

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

        state = store.getState();
        const stepData = getDataStepByName(stepName)(state);
        const permission = getPermission(stepName)(state);
        const elementsKeys = permission.getElements().map((item) => item.name);
        const isExistCards = Object.keys(stepData.cards).some((item) =>
          elementsKeys.includes(item)
        );
        const positionNewStep =
          getPositionStepNameBasedOnActiveStep(stepName)(state);
        if (!isExistCards) {
          const { prevStep, nextStep } =
            getPrevNextStepByStepName(stepName)(state);
          if (positionNewStep === "next" && nextStep) {
            return store.dispatch(changeActiveStep(nextStep.key));
          }
          if (positionNewStep === "prev" && prevStep) {
            return store.dispatch(changeActiveStep(prevStep.key));
          }
        }
        const prepareStepNames = getPrepareStepNames();
        if (positionNewStep === "prev" && prepareStepNames.includes(stepName)) {
          const stepIndex = prepareStepNames.indexOf(stepName);
          const arrStepNames = getArrayStepNames();
          arrStepNames.forEach((step, index) => {
            if (index <= stepIndex) return;
            const stepData = getDataStepByName(step)(state);
            deleteNodesByCards(Object.values(stepData.cards))(store);
          });

          const stepsToInclude = prepareStepNames.slice(0, stepIndex + 1);
          store.dispatch(
            clearAllActiveCardsSteps({
              ignoreSteps: stepsToInclude,
            })
          );
        }
        break;
      }
      case UI_ACTION_NAME.MOVE_TO_START_STEP: {
        app.resetApplication();
        store.dispatch(clearAllActiveCardsSteps({}));
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

        updateActiveCardsByPermissionData(permission)(store);

        const updateNodes = updateNodesByConfiguration(
          currentConfigurator,
          activeStep
        );

        const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
        updateNodes(store, attributeNames);

        updateAssetIdByKeyPermission(key)(store);
        break;
      }

      case UI_ACTION_NAME.REMOVE_ACTIVE_CARD: {
        const { key } = action.payload;
        const activeStep = getActiveStep(state);

        const permission = getPermission(activeStep)(state);
        permission.processRemoveActiveElementByName(key);

        updateActiveCardsByPermissionData(permission)(store);

        const card = getCardByKeyPermission(activeStep, key)(state);
        removeElement(card, activeStep)(store);
        setDefaultsNode(activeStep)(store);
        break;
      }

      case UI_ACTION_NAME.CHANGE_ACTIVE_STEP: {
        const stepName = action.payload;

        const permission = getPermission(stepName)(state);

        updateActiveCardsByPermissionData(permission)(store);

        setDefaultsNode(stepName)(store);

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

        const autoChangeItems = getAutoChangeDataByKeyPermission(
          activeStep,
          key
        )(state);
        const keysItems = Object.entries(autoChangeItems)
          .filter((item) => item[1].includes("count"))
          .map(([key]) => key);

        keysItems.push(key);

        const prevValues: Record<string, number> = {};
        keysItems.forEach((key) => {
          const prevCount = getPropertyCounterCardByKeyPermission(
            activeStep,
            key
          )(state);
          if (prevCount === undefined) return;
          prevValues[key] = prevCount;
        });

        if (!Object.keys(prevValues).length) return;

        store.dispatch(
          setPropertyItem({
            step: activeStep,
            keyItemPermission: key,
            property: {
              count: value,
            },
          })
        );

        updateDataCardByStepName(activeStep)(store, currentConfigurator);

        changeCountElement(key, activeStep, value, prevValues)(store);
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
            const stepElement = getStepNameByKeyPermission(key)(state);
            if (!stepElement) return;
            store.dispatch(
              setPropertyItem({
                step: stepElement,
                keyItemPermission: key,
                property: {
                  color: value,
                },
              })
            );
          }
        );

        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        updateActiveCardsByPermissionData(permission)(store);
        store.dispatch(addActiveCard({ key }));

        changeColorElement(key, activeStep)(store);

        const updateNodes = updateNodesByConfiguration(
          currentConfigurator,
          activeStep
        );

        const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
        updateNodes(store, attributeNames);
        break;
      }
      case UI_ACTION_NAME.CLEAR_ALL_ACTIVE_CARDS_STEPS: {
        const { ignoreSteps } = action.payload;
        const arrayStepName = Object.values(StepName);
        arrayStepName.forEach((stepName) => {
          if (ignoreSteps && ignoreSteps.includes(stepName)) return;
          const cards = Object.values(getCardsByStep(stepName)(state));
          deleteNodesByCards(cards)(store);
        });
        break;
      }
      case CONFIGURATOR_ACTION_NAME.CHANGE_VALUE_NODES: {
        const updatedNodes = action.payload;

        updateHighlightNodes(updatedNodes)(store);
        break;
      }
      default:
        break;
    }
    return res;
  };
