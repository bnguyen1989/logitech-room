import { FORM_MKTO } from "../../../utils/formUtils";
import s from "./ModalContainerFormWrap.module.scss";

interface PropsI {
  children: React.ReactNode;
  position?: "center" | "right";
  formName?: string;
}
export const ModalContainerFormWrap: React.FC<PropsI> = (props) => {
  const { children, position = "center", formName } = props;

  let classModalBox = `${s["container_modal_" + position]} `;

  if (formName === FORM_MKTO.FULL_FORM) classModalBox += ` ${s.FULL_FORM}`;
  console.log("formName", formName);

  return (
    <div className={s.container_screen}>
      <div className={classModalBox}>{children}</div>
    </div>
  );
};
