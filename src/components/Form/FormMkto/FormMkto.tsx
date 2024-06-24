import s from "./FormMkto.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
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

function checkAndToggleDisplay(): void {
  // Get all elements with the class 'mktoFormRow'
  const formRows: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".mktoFormRow");

  // Iterate over each 'mktoFormRow' element
  formRows.forEach((row: HTMLDivElement) => {
    // Check if there is an input element with type 'hidden' within the current 'mktoFormRow' element
    const hiddenInput: HTMLInputElement | null = row.querySelector(
      'input[type="hidden"]'
    );

    // If a hidden input is found, set display to none; otherwise, remove display property
    if (hiddenInput) {
      row.style.display = "none";
    } else {
      row.style.display = "";
    }
  });

  // Request the next animation frame
  requestAnimationFrame(checkAndToggleDisplay);
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

  const isRunning = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndToggleDisplay = useCallback((): void => {
    // Get all elements with the class 'mktoFormRow'
    const formRows = document.querySelectorAll<HTMLDivElement>(".mktoFormRow");

    // Iterate over each 'mktoFormRow' element
    formRows.forEach((row: HTMLDivElement) => {
      // Check if there is an input element with type 'hidden' within the current 'mktoFormRow' element

      const hiddenInput = row.querySelector<HTMLInputElement>(
        'input[type="hidden"]'
      );

      const honeypotInput =
        row.querySelector<HTMLInputElement>("input#honeypot");

      const noInputFields =
        row.querySelectorAll<HTMLInputElement>("input").length === 0;
      const noSelectFields =
        row.querySelectorAll<HTMLInputElement>("select").length === 0;
      const noTextareaFields =
        row.querySelectorAll<HTMLInputElement>("textarea").length === 0;

      const notFields = noInputFields && noSelectFields && noTextareaFields;

      // If a hidden input is found, set display to none; otherwise, remove display property
      if (hiddenInput || honeypotInput || notFields) {
        row.style.display = "none";
      } else {
        row.style.display = "";
      }
    });

    // Request the next animation frame if running
    if (isRunning.current) {
      animationFrameId.current = requestAnimationFrame(checkAndToggleDisplay);
    }
  }, []);

  const startCheckAndToggleDisplay = useCallback((): void => {
    if (!isRunning.current) {
      isRunning.current = true;
      checkAndToggleDisplay();
    }
  }, [checkAndToggleDisplay]);

  const stopCheckAndToggleDisplay = useCallback((): void => {
    if (isRunning.current) {
      isRunning.current = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
  }, []);

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

      startCheckAndToggleDisplay();

      form.onSuccess((data: any) => {
        console.log("Logger::Mkto:onSuccess", data);

        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
          submitTimeoutRef.current = null;
        }
        if (!isRequest) {
          stopCheckAndToggleDisplay();
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
          stopCheckAndToggleDisplay();
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

    return () => {
      stopCheckAndToggleDisplay();
    };
  }, []);

  return (
    <div key={uuidv4()} className="div">
      <div key={uuidv4()} className={`${s.formWrap} ${formClassName}`}>
        <form key={uuidv4()} id={`mktoForm_${formId}`}></form>
      </div>
    </div>
  );
};
