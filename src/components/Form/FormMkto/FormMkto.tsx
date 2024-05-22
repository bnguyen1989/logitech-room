import s from "./FormMkto.module.scss";
import { useEffect, useRef, useState } from "react";
import "./form.css";
import {
  FORM_MKTO,
  getFormIdLocale,
} from "../../../utils/formUtils";
import { useLocale } from "../../../hooks/useLocal";
import { toCamelCase } from "../../../utils/strUtils";

declare const MktoForms2: any;

interface FormMktoPropsI {
  formName: FORM_MKTO;
  buttonText: string;
  initialValues?: Record<string, string>;
  onSubmit: (formData: any) => void;
}

export const FormMkto: React.FC<FormMktoPropsI> = ({
  formName,
  buttonText,
  initialValues,
  onSubmit,
}: FormMktoPropsI) => {

  const formLoaded = useRef(false);
  const [isRequest, setIsRequest] = useState(false);
  const locale = useLocale();
  const formId = getFormIdLocale(formName, locale);
  const formClassName = toCamelCase(formName);

  useEffect(() => {

    if (MktoForms2.getForm(formId) === undefined && !formLoaded.current) {

      formLoaded.current = true;

      MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", formId);

      MktoForms2.whenReady((form: any) => {
  
        if (initialValues) {
          Object.entries(initialValues).forEach(([key, value]) => {
            form.setValues({
              [key]: value,
            });
          })
        }
  
        form.onSubmit(() => {
          if (!isRequest) {
            setIsRequest(true);
            onSubmit({ ...form.getValues() });
          }
          return false;
        });
  
        const button = document.querySelector(`.${formClassName} .mktoButton`);
        if (button) {
          button.textContent = buttonText;
        }
  
      });
    }
    
  }, []);

  return (
    <div className={`${s.formWrap} ${formClassName}`}>
      <form id={`mktoForm_${formId}`}></form>
    </div>
  );
};
