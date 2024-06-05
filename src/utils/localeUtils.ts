import { LocaleT } from "../types/locale";

export const langRegionCodes: Record<string, LocaleT> = {
  en_us: "en-US",
  es_es: "es-ES",
  de_de: "de-DE",
  es_mx: "es-MX",
  en_gb: "en-GB",
};

export const localeToCurrency: Record<LocaleT, string> = {
  "en-US": "USD",
  "de-DE": "EUR",
  "es-MX": "MXN",
  "en-GB": "GBP",
  "es-ES": "EUR",
};
