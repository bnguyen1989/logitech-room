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
      "fr-CA": 18414,
      "fr-FR": 18414,
      "fr-CH": 18414,
      "fr-BE": 18414,
      "it-IT": 18414,
      "it-CH": 18414,
      "ja-JP": 18414,
      "nl-NL": 18414,
      "nl-BE": 18414,
      "pt-BR": 18414,
      "zh-CN": 18414,
      "en-CA": 18414,
      "en-IN": 18414,
      "en-AU": 18414,
      "en-EU": 18414,
      "en-MY": 18414,
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
      "fr-CA": 18461,
      "fr-FR": 18461,
      "fr-CH": 18461,
      "fr-BE": 18461,
      "it-IT": 18461,
      "it-CH": 18461,
      "ja-JP": 18461,
      "nl-NL": 18461,
      "nl-BE": 18461,
      "pt-BR": 18461,
      "zh-CN": 18461,
      "en-CA": 18461,
      "en-IN": 18461,
      "en-AU": 18461,
      "en-EU": 18461,
      "en-MY": 18461,
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
      "fr-CA": 18463,
      "fr-FR": 18463,
      "fr-CH": 18463,
      "fr-BE": 18463,
      "it-IT": 18463,
      "it-CH": 18463,
      "ja-JP": 18463,
      "nl-NL": 18463,
      "nl-BE": 18463,
      "pt-BR": 18463,
      "zh-CN": 18463,
      "en-CA": 18463,
      "en-IN": 18463,
      "en-AU": 18463,
      "en-EU": 18463,
      "en-MY": 18463,
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
