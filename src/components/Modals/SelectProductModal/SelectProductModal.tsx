import React from "react";
import s from "./SelectProductModal.module.scss";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { CloseSVG, WarningSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getSelectedConfiguratorCards } from "../../../store/slices/ui/selectors/selectors";
import { getSelectProductModalData } from "../../../store/slices/modals/selectors/selectors";
import { useDispatch } from "react-redux";
import { setSelectProductModal } from "../../../store/slices/modals/Modals.slice";
import { SelectProductCard } from "./card/SelectProductCard";
import { clearAllActiveCardsSteps } from "../../../store/slices/ui/Ui.slice";
import { StepName } from "../../../utils/baseUtils";
import { Application } from "../../../models/Application";

declare const app: Application;

export const SelectProductModal: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCards = useAppSelector(getSelectedConfiguratorCards);
  const { isOpen, dataModal } = useAppSelector(getSelectProductModalData);

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

  const getEditCallback = (attributeName: string) => {
    if (!dataModal) return;
    if (attributeName !== dataModal.attributeName) return;
    return handleEdit;
  };

  if (!isOpen) return null;

  return (
    <ModalContainer position={"right"}>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.text}>Your Room selections</div>
          <IconButton onClick={handleClose}>
            <CloseSVG color={"white"} />
          </IconButton>
        </div>
        <div className={s.title}>
          <div className={s.icon}>
            <WarningSVG />
          </div>
          <div className={s.text}>
            These are your current product selections. You will have to
            re-select other products if you change your main conference camera.
          </div>
        </div>
        <div className={s.cards}>
          {selectedCards.map((card, index) => (
            <SelectProductCard
              key={index}
              keyItemPermission={card.keyPermission}
              callbackEdit={getEditCallback(card.dataThreekit.attributeName)}
            />
          ))}
        </div>
      </div>
    </ModalContainer>
  );
};
