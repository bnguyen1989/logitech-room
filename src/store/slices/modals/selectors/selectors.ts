import { RootState } from "../../../";
import { StepName } from "../../../../utils/baseUtils";
import {
  getActiveStep,
  getCardsByStep,
  getNavigationStepData,
  getSelectData,
} from "../../ui/selectors/selectors";
import { ModalName } from "../type";

export const getSetupModalData = (state: RootState) => {
  return state.modals[ModalName.MY_SETUP];
};

export const getInfoItemModalData = (state: RootState) => {
  return state.modals[ModalName.INFO_ITEM];
};

export const getSelectProductModalData = (state: RootState) => {
  return state.modals[ModalName.SELECT_PRODUCT];
};

export const getIsShowProductModal =
  (attrName: string) => (state: RootState) => {
    const activeStep = getActiveStep(state);
    if (activeStep !== StepName.ConferenceCamera) return false;
    const cards = getCardsByStep(activeStep)(state);
    const cardsFromAttrName = Object.values(cards).filter((card) => {
      const attributeName = card.dataThreekit.attributeName;
      return attributeName === attrName;
    });
    if (cardsFromAttrName.length < 2) return false;
    const selectedData = getSelectData(state);
    const { nextStep } = getNavigationStepData(state);
    const selectedDataNextStep = selectedData[nextStep.key];
    const isActiveElements = Object.values(selectedDataNextStep).some(
      (item) => item.selected.length > 0
    );
    return isActiveElements;
  };
