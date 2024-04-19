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


export const getDataForAnnotationModal = (keyPermission: any, card: any) =>
  (state: RootState) => {
    if (!keyPermission) return { isActiveCard: undefined, disabledActions: undefined, threekitAsset: undefined }
    if (!card) return { isActiveCard: undefined, disabledActions: undefined, threekitAsset: undefined }

    const activeStep = getActiveStep(state);
    if (!activeStep) return { isActiveCard: undefined, disabledActions: undefined, threekitAsset: undefined }
    const isActiveCard = getIsSelectedCardByKeyPermission(activeStep, keyPermission)(state)

    const disabledActions = getDisabledActionByKeyPermission(activeStep, keyPermission)(state)

    const threekitAsset = getAssetFromCard(card)(state);

    return { isActiveCard, disabledActions, threekitAsset };
  };
