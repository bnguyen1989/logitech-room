import { Store } from "@reduxjs/toolkit";
import { Modal } from "../../../../models/modals/Modal";
import { SelectProductModal } from "../../../../models/modals/SelectProductModal";
import {
  getDataGuideModal,
  getIsShowProductModal,
} from "../selectors/selectors";
import { setGuideModal, setSelectProductModal } from "../Modals.slice";
import { clearAllNodes } from "../../configurator/handlers/handlers";
import { clearAllActiveCardsSteps } from "../../ui/Ui.slice";
import { StepName } from "../../../../utils/baseUtils";

export const getModalsHandlers = (store: Store) => {
  app.eventEmitter.on("showModal", (data: Modal) => {
    const state = store.getState();
    if (data instanceof SelectProductModal) {
      const attributeName = data.attributeName;
      const isShowProductModal = getIsShowProductModal(state);
      if (isShowProductModal) {
        store.dispatch(
          setSelectProductModal({
            isOpen: true,
            dataModal: {
              attributeName: attributeName,
              editHandlerName: "SelectProductModal/edit",
              closeHandlerName: "SelectProductModal/close",
            },
          })
        );

        app.eventEmitter.on("SelectProductModal/edit", () => {
          store.dispatch(
            clearAllActiveCardsSteps({
              ignoreSteps: [
                StepName.RoomSize,
                StepName.Platform,
                StepName.Services,
                StepName.ConferenceCamera,
              ],
              clearProperty: true,
            })
          );
          data.editCallback();
          clearAllNodes()(store);
        });
        app.eventEmitter.on("SelectProductModal/close", () => {
          data.closeCallback();
        });
      } else {
        data.continueCallback();
      }
    }
  });
};

export const showModalByStep = (stepName: StepName) => {
  return (store: Store) => {
    const state = store.getState();
    if (stepName === StepName.ConferenceCamera) {
      const guideModalData = getDataGuideModal(state);
      if (!guideModalData.dataModal?.isFirst) {
        store.dispatch(
          setGuideModal({
            isOpen: true,
            dataModal: {
              isFirst: true,
            },
          })
        );
      }
    }
  };
};
