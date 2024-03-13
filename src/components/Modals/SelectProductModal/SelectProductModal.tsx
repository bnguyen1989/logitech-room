import React from "react";
import s from "./SelectProductModal.module.scss";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { CloseSVG, EditSVG, WarningSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getSelectedConfiguratorCards } from "../../../store/slices/ui/selectors/selectors";
import { getSelectProductModalData } from "../../../store/slices/modals/selectors/selectors";
import { useDispatch } from "react-redux";
import { setSelectProductModal } from "../../../store/slices/modals/Modals.slice";

export const SelectProductModal: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCards = useAppSelector(getSelectedConfiguratorCards);
  const { isOpen } = useAppSelector(getSelectProductModalData);
  console.log("selectedCards", selectedCards);

  const handleClose = () => {
    dispatch(setSelectProductModal({ isOpen: false }));
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
            <div key={index} className={s.wrapper}>
              <div className={s.divider}></div>
              <div className={s.card}>
                <div className={s.left_content}>
                  <div className={s.image}>
                    <img src={card.image} alt={"image"} />
                  </div>
                </div>
                <div className={s.right_content}>
                  <div className={s.text}>
                    <div className={s.header_title}>{card.key}</div>
                    {/* <div className={s.title_text}>{card.title}</div> */}
                    <div className={s.subtitle}>{card.subtitle}</div>
                  </div>
                  <div className={s.button_edit}>
                    <IconButton onClick={() => {}}>
                      <EditSVG />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalContainer>
  );
};
