import { useDispatch } from "react-redux";
import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import { getSetupModalData } from "../../../store/slices/modals/selectors/selectors";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./SetupModal.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./form.css";
import { getParentURL } from "../../../utils/browserUtils";
import { useUser } from "../../../hooks/user";
import { setUserData } from "../../../store/slices/user/User.slice";
import { getSetupModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const MktoForms2: any;

export const SetupModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, dataModal } = useAppSelector(getSetupModalData);
  const user = useUser();
  const dataLang = useAppSelector(getSetupModalLangPage);
  const formLoaded = useRef(false);

  const handleClose = () => {
    dispatch(setMySetupModal({ isOpen: false }));
  };

  useEffect(() => {
    if (!isOpen) {
      formLoaded.current = false;
      return;
    }
    if (formLoaded.current) return;
    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", 18414);
    formLoaded.current = true;

    MktoForms2.whenReady((form: any) => {
      const baseUrl = getParentURL();
      const link = `${baseUrl}/room?userId=${user.id}`;
      form.setValues({
        editableField6: link,
      });

      if (dataModal) {
        form.setValues({
          editableField5: dataModal.linkSnapshot,
        });
      }

      form.onSubmit(() => {
        dispatch(setMySetupModal({ isOpen: false }));
        dispatch(setUserData({ data: { ...form.getValues() } }));
        navigate("/room", { replace: true });
        return true;
      });
      const button = document.querySelector(".mktoButton");
      if (button) {
        button.textContent = dataLang.btn_done;
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
            <div className={s.title}>{dataLang.title}</div>
            <div className={s.subtitle}>{dataLang.subtitle}</div>
          </div>
        </div>

        <div className={s.form}>
          <form id="mktoForm_18414"></form>
        </div>
      </div>
    </ModalContainer>
  );
};
