import { RootState } from "../../..";
import {
  EventActionName,
  EventCategoryName,
  EventDataAnalyticsI,
} from "../../../../models/analytics/type";
import { getRoleData } from "../../user/selectors/selectors";

import {
  getActiveStep,
  getLocale,
  getSelectedCardsByStep,
  getSelectedConfiguratorCards,
  getSelectedPrepareCards,
  getStepData,
} from "./selectors";

export const getDataEvent =
  (
    category: EventCategoryName,
    actionName: EventActionName,
    data: object = {}
  ) =>
  (state: RootState): EventDataAnalyticsI => {
    const locale = getLocale(state);
    const baseDataEvent = {
      category: category,
      action: actionName,
      locale: locale,
      value: {
        ...data,
      },
    };
    switch (category) {
      case EventCategoryName.get_started: {
        switch (actionName) {
          case EventActionName.chose_type_user: {
            const userRole = getRoleData(state);
            return {
              ...baseDataEvent,
              value: {
                ...baseDataEvent.value,
                user: userRole.name,
              },
            };
          }
          default:
            return baseDataEvent;
        }
      }
      case EventCategoryName.threekit_configurator: {
        const activeStep = getActiveStep(state);
        const tempDataEvent = {
          ...baseDataEvent,
          value: {
            step_name: activeStep,
          },
        };

        switch (actionName) {
          case EventActionName.step_complete: {
            const stepData = getStepData(state);
            const keysStep = Object.keys(stepData);
            const index = keysStep.indexOf(activeStep);
            const selected_step_cards =
              getSelectedCardsByStep(activeStep)(state);
            return {
              ...tempDataEvent,
              value: {
                ...tempDataEvent.value,
                step_num: index,
                selected_step_cards: selected_step_cards,
              },
            };
          }
          case EventActionName.configurator_complete: {
            const selected_cards = [
              ...getSelectedPrepareCards(state),
              ...getSelectedConfiguratorCards(state),
            ];
            return {
              ...tempDataEvent,
              value: {
                ...tempDataEvent.value,
                selected_cards: selected_cards,
              },
            };
          }
          default:
            return baseDataEvent;
        }
      }

      case EventCategoryName.summery_page:
      case EventCategoryName.room_page:
        return baseDataEvent;
      default:
        return baseDataEvent;
    }
  };
