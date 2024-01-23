import { RootState } from '../../../'
import { ModalName } from '../type'

export const getSetupModalData = (state: RootState) => {
  return state.modals[ModalName.MY_SETUP];
};

export const getInfoItemModalData = (state: RootState) => {
  return state.modals[ModalName.INFO_ITEM];
}