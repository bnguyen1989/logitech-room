import s from "./RequestConsultation.module.scss";
import { getImageUrl } from "../../utils/browserUtils";
import { useEffect } from "react";
import { getTKAnalytics } from "../../utils/getTKAnalytics";
import { useAppSelector } from "../../hooks/redux";
import { getRequestConsultationLangPage } from "../../store/slices/ui/selectors/selectoteLangPage";
import { divideTextIntoSentence } from "../../utils/strUtils";

export const RequestConsultation = () => {
  const langPage = useAppSelector(getRequestConsultationLangPage);
  useEffect(() => {
    getTKAnalytics().stage({ stageName: "Request Consultation" });
  }, []);

  const arrTextSentences = divideTextIntoSentence(langPage.text);
  return (
    <div className={s.container}>
      <div className={s.image_wrap}>
        <div
          className={s.image}
          style={{
            backgroundImage: `url(${getImageUrl(
              "images/getStarted/banner.png"
            )})`,
          }}
        ></div>
      </div>

      <div className={s.content}>
        <div className={s.title}>{arrTextSentences[0]}</div>
        <div className={s.subtitle}>
          {langPage.text.replace(arrTextSentences[0], "").trim()}
        </div>
      </div>
    </div>
  );
};
