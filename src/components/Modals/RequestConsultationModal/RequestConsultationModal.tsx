import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/redux";
import { getRequestConsultationModalData } from "../../../store/slices/modals/selectors/selectors";
import { FORM_MKTO } from "../../../utils/formUtils";
import { FormMkto } from "../../Form/FormMkto/FormMkto";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./RequestConsultationModal.module.scss";
import { setRequestConsultationModal } from "../../../store/slices/modals/Modals.slice";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { CloseSVG } from "../../../assets";
import { useNavigate } from "react-router-dom";

export const RequestConsultationModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getRequestConsultationModalData);

  const handleClose = () => {
    dispatch(setRequestConsultationModal({ isOpen: false }));
  };

  const handleSubmit = () => {
    debugger
    handleClose();
    navigate("/request-consultation", { replace: true });
  };

  if (!isOpen) return null;
  return (
    <ModalContainer>
      <div className={s.containerRequestConsultationModal}>
        <div className={s.header}>
          <div className={s.close}>
            <IconButton onClick={handleClose}>
              <CloseSVG />
            </IconButton>
          </div>
        </div>
        <FormMkto
          formName={FORM_MKTO.REQUEST_CONSULTATION}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalContainer>
  );
};
