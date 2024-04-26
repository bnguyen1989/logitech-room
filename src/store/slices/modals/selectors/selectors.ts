import { RootState } from "../../../";
import { StepName } from "../../../../utils/baseUtils";
import {
  getActiveStep,
  getAssetFromCard,
  getCardsByStep,
  getDisabledActionByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getNavigationStepData,
  getSelectData,
} from "../../ui/selectors/selectors";
import { CardI } from "../../ui/type";
import { ModalName } from "../type";

export const getSetupModalData = (state: RootState) => {
  return state.modals[ModalName.MY_SETUP];
};

export const getAnnotationModalData = (state: RootState) => {
  return state.modals[ModalName.ANNOTATION_ITEM];
};

export const getSelectProductModalData = (state: RootState) => {
  return state.modals[ModalName.SELECT_PRODUCT];
};

export const getShareProjectModalData = (state: RootState) => {
  return state.modals[ModalName.SHARE_PROJECT];
};

export const getFinishModalData = (state: RootState) => {
  return state.modals[ModalName.FINISH];
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

export const getDataForAnnotationModal =
  (keyPermission: string, card: CardI) => (state: RootState) => {
    if (!keyPermission || !card) return {};

    const activeStep = getActiveStep(state);
    if (!activeStep) return {};
    const isActiveCard = getIsSelectedCardByKeyPermission(
      activeStep,
      keyPermission
    )(state);

    const disabledActions = getDisabledActionByKeyPermission(
      activeStep,
      keyPermission
    )(state);

    const threekitAsset = getAssetFromCard(card)(state);

    return { isActiveCard, disabledActions, threekitAsset };
  };
