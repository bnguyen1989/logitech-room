export type LanguageData = {
  languageCode: string;
  localeCode: string;
  currencyCode: string;
};
export type LocaleCodeOnly = LanguageData["currencyCode"];
