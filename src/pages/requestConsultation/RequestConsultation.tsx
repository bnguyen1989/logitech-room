import s from "./RequestConsultation.module.scss";
import { getImageUrl } from "../../utils/browserUtils";
import { useEffect } from "react";
import { getTKAnalytics } from "../../utils/getTKAnalytics";
import { useAppSelector } from "../../hooks/redux";
import { getRequestConsultationLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";
import { divideTextIntoSentence } from "../../utils/strUtils";
import { FORM_MKTO } from "../../utils/formUtils";
import { FormMkto } from "../../components/Form/FormMkto/FormMkto";
import { useState } from "react";
import { ModalContainer } from "../../components/Modals/ModalContainer/ModalContainer";

export const RequestConsultation = () => {

  const [contentName, setContent] = useState<"form1" | "form2" | "thank">(
    "thank"
  );

  const langPage = useAppSelector(getRequestConsultationLangPage);
  useEffect(() => {
    getTKAnalytics().stage({ stageName: "Request Consultation" });
  }, []);

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

  const arrTextSentences = divideTextIntoSentence(langPage.text);
  return (
    <div className={s.container}>
      <div className={s.image_wrap}>
        <div
          className={s.image}
          style={{
            backgroundImage: `url(${getImageUrl(
              "images/getStarted/banner.png"
            )})`,
          }}
        ></div>
      </div>

      <div className={s.content}>
        <div className={s.title}>{arrTextSentences[0]}</div>
        <div className={s.subtitle}>
          {langPage.text.replace(arrTextSentences[0], "").trim()}
        </div>
      </div>
    </div>
  );
};
