import s from "./FormMkto.module.scss";
import { memo, useEffect, useRef, useState } from "react";
import { FORM_MKTO, getFormIdLocale } from "../../../utils/formUtils";
import { useLocale } from "../../../hooks/useLocal";
import { toCamelCase } from "../../../utils/strUtils";

declare const MktoForms2: any;

interface FormMktoPropsI {
  formName: FORM_MKTO;
  buttonText?: string;
  initialValues?: Record<string, string>;
  onSubmit: (formData: any) => void;
}

export const FormMkto: React.FC<FormMktoPropsI> = memo(
  ({ formName, buttonText, initialValues, onSubmit }: FormMktoPropsI) => {
    const formLoaded = useRef(false);
    const [isRequest, setIsRequest] = useState(false);
    const locale = useLocale();
    const formId = getFormIdLocale(formName, locale);
    const formClassName = toCamelCase(formName);

    const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    //
    useEffect(() => {
      if (formLoaded.current) return;

      const initMunchkin = () => {
        if (window.Munchkin) {
          window.Munchkin.init("201-WGH-889");
        }
      };
      initMunchkin();

      MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", formId);

      MktoForms2.whenReady((form: any) => {
        if (initialValues) {
          Object.entries(initialValues).forEach(([key, value]) => {
            form.setValues({
              [key]: value,
            });
          });
        }

        debugger;
        form.onSuccess((data: any) => {
          debugger;
          console.log("test onSuccess ", data);

          if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current);
            submitTimeoutRef.current = null;
          }
          if (!isRequest) {
            setIsRequest(true);
            onSubmit({ ...form.getValues() });
            return false;
          }
        });

        form.onSubmit(() => {
          debugger;
          // console.log("test onSubmit data ", data);
          // onSubmit({ ...form.getValues() }); // Trigger onSubmit immediately on form submission
          submitTimeoutRef.current = setTimeout(() => {
            if (!submitTimeoutRef.current) return; // Check if it's already cleared by onSuccess
            console.log(
              "onSuccess did not fire within 15 seconds. Submitting form."
            );
            onSubmit({ ...form.getValues() });
          }, 2000); // 15000 milliseconds equals 15 seconds
        });

        if (buttonText) {
          const button = document.querySelector(
            `.${formClassName} .mktoButton`
          );
          if (button) {
            button.textContent = buttonText;
          }
        }
      });

      // MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", formId);
      formLoaded.current = true;

      // MktoForms2.whenReady((form: any) => {});
    }, []);

    return (
      <div className={`${s.formWrap} ${formClassName}`}>
        <form id={`mktoForm_${formId}`}></form>
      </div>
    );
  }
);
