import { useDispatch } from "react-redux";
import { CloseSVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import { getSetupModalData } from "../../../store/slices/modals/selectors/selectors";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { ModalContainer } from "../ModalContainer/ModalContainer";
import s from "./SetupModal.module.scss";
import {
  getParentURL,
  getParentURLForRevert,
} from "../../../utils/browserUtils";
import { useUser } from "../../../hooks/user";
import { setUserData } from "../../../store/slices/user/User.slice";
import { getSetupModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
import { useUrl } from "../../../hooks/url";
import { FormMkto } from "../../Form/FormMkto/FormMkto";
import { FORM_MKTO } from "../../../utils/formUtils";
import { RoleUserName } from "../../../utils/userRoleUtils";
import { useCallback } from "react";

export const SetupModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getSetupModalData);
  const user = useUser();
  const { handleNavigate } = useUrl();
  const dataLang = useAppSelector(getSetupModalLangPage);

  const handleClose = () => {
    dispatch(setMySetupModal({ isOpen: false }));
  };

  const getFormName = () => {
    if (user.role.name === RoleUserName.PARTNER) {
      return FORM_MKTO.ABRIDGE_FORM;
    }

    return FORM_MKTO.FULL_FORM;
  };

  const getInitialValues = () => {
    const initialValues: Record<string, string> = {};
    const baseUrl = getParentURLForRevert();

    const link = `${baseUrl}#/room?userId=${user.id}`;

    initialValues.editableField5 = link;

    // if (dataModal) {
    //   initialValues.editableField6 = JSON.stringify({
    //     resumableLink: link,
    //     linkSnapshot: dataModal.linkSnapshot,
    //   });
    //   initialValues.editableField5 = JSON.stringify({
    //     linkSnapshot: dataModal.linkSnapshot,
    //   });
    // }

    return initialValues;
  };

  const handleSubmit = useCallback(
    (formData: any) => {
      dispatch(setMySetupModal({ isOpen: false }));
      dispatch(setUserData({ data: { ...formData } }));
      handleNavigate("/room");
      console.log("loger::handleSubmit");
    },
    [dispatch, handleNavigate]
  );

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

        <FormMkto
          formName={getFormName()}
          initialValues={getInitialValues()}
          buttonText={dataLang.btn_done}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalContainer>
  );
};
