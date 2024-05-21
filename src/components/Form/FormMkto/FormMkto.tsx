import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/redux";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import s from "./SetupModal.module.scss";
import { useNavigate } from "react-router-dom";
import { ThreekitService } from "../../../services/Threekit/ThreekitService";
import { useEffect, useState } from "react";
import "./form.css";
import { getOrderData } from "../../../store/slices/ui/selectors/selectorsOrder";
import { getParentURL } from "../../../utils/browserUtils";
import { useUser } from "../../../hooks/user";
import { setUserData } from "../../../store/slices/user/User.slice";
import { FORM_MKTO, formLocalization } from "../../../utils/formUtils";

declare const MktoForms2: any;

interface FormMktoPropsI {
  formName: FORM_MKTO;
  buttonText: string;
}

export const FormMkto: React.FC<FormMktoPropsI> = ({
  formName,
  buttonText,
}: FormMktoPropsI) => {

  const formData = formLocalization[formName];
  console.log("formData --- ==== ", formData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useUser();
  const orderData: any = useAppSelector(getOrderData(user.id));
  const [isRequest, setIsRequest] = useState(false);

  useEffect(() => {

    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", 18461);

    MktoForms2.whenReady((form: any) => {
      const baseUrl = getParentURL();
      const link = `${baseUrl}/room?userId=${user.id}`;
      form.setValues({
        editableField6: link,
      });

      const threekitService = new ThreekitService();

      const assetId = orderData.metadata.configurator.assetId;
      const snapshot = window.snapshot("blob") as Blob;
      threekitService.saveConfigurator(snapshot, assetId ?? "").then((id) => {
        const linkSnapshot = threekitService.getSnapshotLinkById(id);
        form.setValues({
          editableField5: linkSnapshot,
        });
      });

      form.onSubmit(() => {
        if (!isRequest) {
          setIsRequest(true);
          threekitService.createOrder(orderData).then(() => {
            dispatch(setMySetupModal({ isOpen: false }));
            dispatch(setUserData({ data: { ...form.getValues() } }));
            navigate("/room", { replace: true });
          });
        }

        return false;
      });

      const button = document.querySelector(".mktoButton");
      if (button) {
        button.textContent = buttonText;
      }

    });
  }, []);

  return (
    <div className={s.container}>
      <div className={s.form}>
        <form id="mktoForm_18461"></form>
      </div>
    </div>
  );
};
