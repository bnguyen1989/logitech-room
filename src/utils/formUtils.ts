export enum FORM_MKTO {
  FULL_FORM = "Full Form",
  ABRIDGE_FORM = "Abridge Form",
  REQUEST_CONSULTATION = "Request Consultation",
}

export const formLocalization = {
  [FORM_MKTO.FULL_FORM]: {
    name: FORM_MKTO.FULL_FORM,
    localization: {
      "EN-US": 18414,
      "DE-DE": 18509,
      "ES-ES": 18515,
      "ES-MX": 18518,
    }
  },
  [FORM_MKTO.ABRIDGE_FORM]: {
    name: FORM_MKTO.ABRIDGE_FORM,
    localization: {
      "EN-US": 18461,
      "DE-DE": 18523,
      "ES-ES": 18524,
      "ES-MX": 18530,
    }
  },
  [FORM_MKTO.REQUEST_CONSULTATION]: {
    name: FORM_MKTO.REQUEST_CONSULTATION,
    localization: {
      "EN-US": 18463,
      "DE-DE": 18532,
      "ES-ES": 18533,
      "ES-MX": 18534,
    }
  },
}

export const getFormIdLocale = (formName: FORM_MKTO, localeUI: string) => {
  const formData = formLocalization[formName];
  if (formData["localization"].hasOwnProperty(localeUI)) {
    // @ts-ignore
    return formData["localization"][localeUI.toUpperCase()]
  }
  return formData["localization"]["EN-US"];
}