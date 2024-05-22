import s from "./RequestConsultation.module.scss";
import { getImageUrl } from "../../utils/browserUtils";
import { FORM_MKTO } from "../../utils/formUtils";
import { FormMkto } from "../../components/Form/FormMkto/FormMkto";
import { useState } from "react";
import { ModalContainer } from "../../components/Modals/ModalContainer/ModalContainer";

export const RequestConsultation = () => {
  const [contentName, setContent] = useState<"form1" | "form2" | "thank">(
    "thank"
  );

  if (contentName === "form1") {
    return (
      <ModalContainer>
        <div className={s.containerForm1}>
          <FormMkto
            formName={FORM_MKTO.ABRIDGE_FORM}
            buttonText="Next Form"
            onSubmit={(formData: any) => {
              console.log("formData --- ==== ", formData);
              setContent("form2");
            }}
          />
        </div>
      </ModalContainer>
    );
  }

  if (contentName === "form2") {
    return (
      <ModalContainer>
        <div className={s.containerForm2}>
          <FormMkto
            formName={FORM_MKTO.REQUEST_CONSULTATION}
            buttonText="Submit"
            onSubmit={(formData: any) => {
              console.log("formData --- ==== ", formData);
              setContent("thank");
            }}
          />
        </div>
      </ModalContainer>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={getImageUrl("images/getStarted/banner.png")} alt={"banner"} />
      </div>

      <div className={s.content}>
        <div className={s.title}>Thank you for your request!</div>
        <div className={s.subtitle}>
          We will reach out shortly to discuss any remaining needs to finalize
          your quote and next steps.
        </div>
      </div>
    </div>
  );
};
