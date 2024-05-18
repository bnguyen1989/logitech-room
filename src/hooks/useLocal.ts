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

  useEffect(() => {
    if (!localParam) {
      dispatch(updateLocale("en-us"));
      return;
    }
    if (localParam === locale) return;

    dispatch(updateLocale(localParam));
  }, [localParam, locale, dispatch]);

  return locale;
};
