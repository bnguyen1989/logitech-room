import { RootState } from '../../../'
import { ModalName } from '../type'

export const getSetupModalData = (state: RootState) => {
  return state.modals[ModalName.MY_SETUP];
};