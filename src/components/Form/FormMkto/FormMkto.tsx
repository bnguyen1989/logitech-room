import s from "./FormMkto.module.scss";
import { useEffect, useRef, useState } from "react";
import { FORM_MKTO, getFormIdLocale } from "../../../utils/formUtils";
import { useLocale } from "../../../hooks/useLocal";
import { toCamelCase } from "../../../utils/strUtils";
import { v4 as uuidv4 } from "uuid";

declare const MktoForms2: any;

interface FormMktoPropsI {
  formName: FORM_MKTO;
  buttonText?: string;
  initialValues?: Record<string, string>;
  onSubmit: (formData: any) => void;
}

const setMarketoForm = (value: any) => {
  //@ts-ignore
  window.formLoadedMarketo = value;
};

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

  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  //

  useEffect(() => {
    if (formLoaded.current) return;
    //@ts-ignore
    if (window.formLoadedMarketo) return;

    const initMunchkin = () => {
      if (window.Munchkin) {
        window.Munchkin.init("201-WGH-889");
      }
    };
    initMunchkin();

    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", formId);

    MktoForms2.whenReady((form: any) => {
      console.log("Logger::Mkto:whenReady");
      // debugger;
      if (initialValues) {
        Object.entries(initialValues).forEach(([key, value]) => {
          form.setValues({
            [key]: value,
          });
        });
      }

      form.onSuccess((data: any) => {
        console.log("Logger::Mkto:onSuccess", data);

        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
          submitTimeoutRef.current = null;
        }
        if (!isRequest) {
          setIsRequest(true);
          onSubmit({ ...form.getValues() });
          setMarketoForm(false);
          return false;
        }
      });

      form.onSubmit(() => {
        console.log("Logger::Mkto:onSubmit");
        submitTimeoutRef.current = setTimeout(() => {
          if (!submitTimeoutRef.current) return; // Check if it's already cleared by onSuccess
          setMarketoForm(false);
          onSubmit({ ...form.getValues() });
        }, 25000); // 15000 milliseconds equals 15 seconds
      });

      if (buttonText) {
        const button = document.querySelector(`.${formClassName} .mktoButton`);
        if (button) {
          button.textContent = buttonText;
        }
      }
    });

    formLoaded.current = true;
    setMarketoForm(true);
  }, []);

  return (
    <div key={uuidv4()} className="div">
      <div key={uuidv4()} className={`${s.formWrap} ${formClassName}`}>
        <form key={uuidv4()} id={`mktoForm_${formId}`}></form>
      </div>
    </div>
  );
};
