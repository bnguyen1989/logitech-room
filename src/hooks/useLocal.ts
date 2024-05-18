import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "./redux";
import { getLocale } from "../store/slices/ui/selectors/selectors";
import { useDispatch } from "react-redux";
import { updateLocale } from "../store/slices/ui/Ui.slice";

export const useLocale = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const localParam = searchParams.get("locale");
  const locale = useAppSelector(getLocale);

  const getLocaleFromPathName = () => {
    const pathName = window.location.pathname;
    const pathNameParts = pathName.split("/");
    const locale = pathNameParts.find((part) =>
      ["es_mx", "es_es", "de_de", "es_us"].includes(part)
    );
    if (locale === "es_us") return "es-us";
    if (locale === "es_es") return "es-ES";
    if (locale === "de_de") return "de";
    if (locale === "es_mx") return "es-MX";
    return locale;
  };

  useEffect(() => {
    const localPathName = getLocaleFromPathName();
    if (localPathName) {
      dispatch(updateLocale(localPathName));
      return;
    }
    if (!localParam) {
      dispatch(updateLocale("en-us"));
      return;
    }
    if (localParam === locale) return;

    dispatch(updateLocale(localParam));
  }, [localParam, locale, dispatch]);

  return locale;
};
