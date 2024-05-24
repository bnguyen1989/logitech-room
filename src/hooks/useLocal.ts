import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "./redux";
import { getLocale } from "../store/slices/ui/selectors/selectors";
import { useDispatch } from "react-redux";
import { updateLocale } from "../store/slices/ui/Ui.slice";
import { langRegionCodes } from "../utils/localeUtils";

export const useLocale = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const localParam = searchParams.get("locale");
  const locale = useAppSelector(getLocale);

  const getLocaleFromPathName = () => {
    const pathName = window.location.href;
    const pathNameParts = pathName.split("/");
    const keysLang = Object.keys(langRegionCodes);
    const locale = pathNameParts.find((part) => [...keysLang].includes(part));
    if (locale && keysLang.includes(locale)) {
      return langRegionCodes[locale];
    }
    return locale;
  };

  useEffect(() => {
    const localPathName = getLocaleFromPathName();

    if (localPathName) {
      dispatch(updateLocale(localPathName));
      return;
    }
    if (!localParam) {
      dispatch(updateLocale("en-US"));
      return;
    }
    if (localParam === locale) return;

    dispatch(updateLocale(localParam));
  }, [localParam, locale, dispatch]);

  return locale;
};
