import React from "react";
import s from "./SelectProductModal.module.scss";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ArrowLeftSVG, CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getSelectProductModalData } from "../../../store/slices/modals/selectors/selectors";
import { useDispatch } from "react-redux";
import { setSelectProductModal } from "../../../store/slices/modals/Modals.slice";
import { clearAllActiveCardsSteps } from "../../../store/slices/ui/Ui.slice";
import { StepName } from "../../../utils/baseUtils";
import { Application } from "../../../models/Application";
import { Button } from "../../Buttons/Button/Button";
import { getSelectProductModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const app: Application;

export const SelectProductModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, dataModal } = useAppSelector(getSelectProductModalData);
  const langPage = useAppSelector(getSelectProductModalLangPage);

  const handleClose = () => {
    dispatch(setSelectProductModal({ isOpen: false, dataModal: undefined }));
    if (dataModal) {
      app.eventEmitter.emit(dataModal.closeHandlerName);
    }
  };

  const handleEdit = () => {
    if (dataModal) {
      app.eventEmitter.emit(dataModal.editHandlerName);
    }

    dispatch(
      clearAllActiveCardsSteps({
        ignoreSteps: [
          StepName.RoomSize,
          StepName.Platform,
          StepName.Services,
          StepName.ConferenceCamera,
        ],
      })
    );
    dispatch(setSelectProductModal({ isOpen: false, dataModal: undefined }));
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG />
            </IconButton>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.title}>{langPage.text}</div>
          <div className={s.actions}>
            <IconButton
              onClick={handleClose}
              variant={"outlined"}
              position={"left"}
              text={langPage.action.Back}
              dataAnalytics={"select-product-modal-back"}
            >
              <ArrowLeftSVG />
            </IconButton>
            <Button
              onClick={() => handleEdit()}
              text={langPage.action.Yes}
              variant={"contained"}
              dataAnalytics={"select-product-modal-lets-proceed"}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
