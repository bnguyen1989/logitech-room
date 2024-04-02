import { RootState } from "../../../";
import { StepName } from "../../../../models/permission/type";
import { getActiveStep, getSelectData } from "../../ui/selectors/selectors";
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

export const getIsShowProductModal = (state: RootState) => {
  const activeStep = getActiveStep(state);
  if (activeStep !== StepName.ConferenceCamera) return false;
  const selectedData = getSelectData(state);
  const selectedDataStep = selectedData[StepName.AudioExtensions];
  const isActiveElements = Object.values(selectedDataStep).some(
    (item) => item.selected.length > 0
  );
  return isActiveElements;
};
