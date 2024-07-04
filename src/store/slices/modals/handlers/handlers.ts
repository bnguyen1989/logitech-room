import { Store } from "@reduxjs/toolkit";
import { Modal } from "../../../../models/modals/Modal";
import { SelectProductModal } from "../../../../models/modals/SelectProductModal";
import { getIsShowProductModal } from "../selectors/selectors";
import { setSelectProductModal } from "../Modals.slice";
import { clearAllNodes } from "../../configurator/handlers/handlers";

export const getModalsHandlers = (store: Store) => {
  app.eventEmitter.on("showModal", (data: Modal) => {
    const state = store.getState();
    if (data instanceof SelectProductModal) {
      const attributeName = data.attributeName;
      const isShowProductModal = getIsShowProductModal(attributeName)(state);
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
