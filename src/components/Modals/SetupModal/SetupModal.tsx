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
import { useUser } from "../../../hooks/user";
import { setUserData } from "../../../store/slices/user/User.slice";
import { getSetupModalLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const MktoForms2: any;

export const SetupModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen } = useAppSelector(getSetupModalData);
  const user = useUser();
  const orderData: any = useAppSelector(getOrderData(user.id));
  const dataLang = useAppSelector(getSetupModalLangPage);

  const handleClose = () => {
    dispatch(setMySetupModal({ isOpen: false }));
  };

  useEffect(() => {
    if (!isOpen) return;
    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", 18414);

    MktoForms2.whenReady((form: any) => {
      const baseUrl = getParentURL();
      const link = `${baseUrl}/room?userId=${user.id}`;
      form.setValues({
        editableField6: link,
      });

      const threekitService = new ThreekitService();

      let snapshotLink = "";
      const assetId = orderData.metadata.configurator.assetId;
      const snapshot = window.snapshot("blob") as Blob;
      threekitService.saveConfigurator(snapshot, assetId ?? "").then((id) => {
        const linkSnapshot = threekitService.getSnapshotLinkById(id);
        form.setValues({
          editableField5: linkSnapshot,
        });
        snapshotLink = linkSnapshot;
      });

      form.onSubmit(
        (() => {
          let isRequest = false;
          return () => {
            if (!isRequest) {
              isRequest = true;
              orderData.metadata["snapshot"] = snapshotLink;
              threekitService.createOrder(orderData).then(() => {
                dispatch(setMySetupModal({ isOpen: false }));
                dispatch(setUserData({ data: { ...form.getValues() } }));
                navigate("/room", { replace: true });
              });
            }

            return isRequest;
          };
        })()
      );
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
