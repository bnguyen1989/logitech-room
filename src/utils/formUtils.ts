import { LocaleT } from "../types/locale";

export enum FORM_MKTO {
  FULL_FORM = "Full Form",
  ABRIDGE_FORM = "Abridge Form",
  REQUEST_CONSULTATION = "Request Consultation",
}

export const formLocalization = {
  [FORM_MKTO.FULL_FORM]: {
    name: FORM_MKTO.FULL_FORM,
    localization: {
      "en-US": 18414,
      "de-DE": 18509,
      "es-ES": 18515,
      "es-MX": 18518,
      "en-GB": 18414,
    },
  },
  [FORM_MKTO.ABRIDGE_FORM]: {
    name: FORM_MKTO.ABRIDGE_FORM,
    localization: {
      "en-US": 18461,
      "de-DE": 18523,
      "es-ES": 18524,
      "es-MX": 18530,
      "en-GB": 18461,
    },
  },
  [FORM_MKTO.REQUEST_CONSULTATION]: {
    name: FORM_MKTO.REQUEST_CONSULTATION,
    localization: {
      "en-US": 18463,
      "de-DE": 18532,
      "es-ES": 18533,
      "es-MX": 18534,
      "en-GB": 18463,
    },
  },
};

export const getFormIdLocale = (
  formName: FORM_MKTO,
  localeUI: LocaleT | ""
) => {
  const { localization } = formLocalization[formName];
  if (!localeUI) return localization["en-US"];
  const isExist = Object.prototype.hasOwnProperty.call(localization, localeUI);
  if (isExist) {
    return localization[localeUI];
  }
  return localization["en-US"];
};
