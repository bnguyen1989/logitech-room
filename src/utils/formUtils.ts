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
      "es-MX": 18515,
      "en-GB": 18414,
      "fr-CA": 19425,
      "fr-FR": 19425,
      "fr-CH": 19425,
      "fr-BE": 19425,
      "it-IT": 19433,
      "it-CH": 19433,
      "ja-JP": 19436,
      "nl-NL": 19437,
      "nl-BE": 19437,
      "pt-BR": 19438,
      "zh-CN": 19439,
      "en-CA": 18414,
      "en-IN": 18414,
      "en-AU": 18414,
      "en-EU": 18414,
      "en-MY": 18414,
      "en-SG": 18414,
    },
  },
  [FORM_MKTO.ABRIDGE_FORM]: {
    name: FORM_MKTO.ABRIDGE_FORM,
    localization: {
      "en-US": 18461,
      "de-DE": 18523,
      "es-ES": 18524,
      "es-MX": 18524,
      "en-GB": 18461,
      "fr-CA": 19430,
      "fr-FR": 19430,
      "fr-CH": 19430,
      "fr-BE": 19430,
      "it-IT": 19434,
      "it-CH": 19434,
      "ja-JP": 19440,
      "nl-NL": 19441,
      "nl-BE": 19441,
      "pt-BR": 19442,
      "zh-CN": 19443,
      "en-CA": 18461,
      "en-IN": 18461,
      "en-AU": 18461,
      "en-EU": 18461,
      "en-MY": 18461,
      "en-SG": 18461,
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
      "fr-CA": 19431,
      "fr-FR": 19431,
      "fr-CH": 19431,
      "fr-BE": 19431,
      "it-IT": 19435,
      "it-CH": 19435,
      "ja-JP": 19447,
      "nl-NL": 19446,
      "nl-BE": 19446,
      "pt-BR": 19445,
      "zh-CN": 19444,
      "en-CA": 18463,
      "en-IN": 18463,
      "en-AU": 18463,
      "en-EU": 18463,
      "en-MY": 18463,
      "en-SG": 18463,
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
