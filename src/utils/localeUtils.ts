import { LocaleT } from "../types/locale";

export const langRegionCodesStaging: Record<string, LocaleT> = {
  en_us: "en-US",
  es_es: "es-ES",
  de_de: "de-DE",
  es_mx: "es-MX",
  en_gb: "en-GB",
};

export const langRegionCodesProd: Record<string, LocaleT> = {
  "en-us": "en-US",
  "es-es": "es-ES",
  "de-de": "de-DE",
  "es-mx": "es-MX",
  "en-gb": "en-GB",
};
export const langRegionCodes: Record<string, LocaleT> = {
  ...langRegionCodesStaging,
  ...langRegionCodesProd,
};

export const localeToCurrency: Record<LocaleT, string> = {
  "en-US": "USD",
  "de-DE": "EUR",
  "es-MX": "MXN",
  "en-GB": "GBP",
  "es-ES": "EUR",
};
