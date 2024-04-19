import { useDispatch } from "react-redux";
import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import { getSetupModalData } from "../../../store/slices/modals/selectors/selectors";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./SetupModal.module.scss";
import { useNavigate } from "react-router-dom";
import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { useEffect } from "react";
import "./form.css";
import { getOrderData } from "../../../store/slices/ui/selectors/selectorsOrder";
import { getParentURL } from "../../../utils/browserUtils";

declare const MktoForms2: any;

export const SetupModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getSetupModalData);
  const orderData: any = useAppSelector(getOrderData);

  const handleClose = () => {
    dispatch(setMySetupModal({ isOpen: false }));
  };

  useEffect(() => {
    if (!isOpen) return;
    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", 18414);

    MktoForms2.whenReady((form: any) => {
      new ThreekitService().createOrder(orderData).then((order) => {
        const baseUrl = getParentURL();
        const link = `${baseUrl}/room/${order.shortId}`;
        form.setValues({
          editableField6: link,
        });
      });

      form.onSubmit(() => {
        dispatch(setMySetupModal({ isOpen: false }));
        navigate("/room", { replace: true });
        return false;
      });
      const button = document.querySelector(".mktoButton");
      if (button) {
        button.textContent = "See my results";
      }
    });
  }, [isOpen]);

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
          <div className={s.text}>
            <div className={s.title}>Show me the complete setup</div>
            <div className={s.subtitle}>
              All finished! Complete the form below so we can share a detailed
              look at your new space and a detailed product details that you can
              download and share.
            </div>
          </div>
        </div>

        <div className={s.form}>
          <form id="mktoForm_18414"></form>
        </div>
      </div>
    </ModalContainer>
  );
};
