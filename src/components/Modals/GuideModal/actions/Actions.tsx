import { ArrowRightSVG } from "../../../../assets";
import { useAppSelector } from "../../../../hooks/redux";
import { getGuideModalLangPage } from "../../../../store/slices/ui/selectors/selectoteLangPage";
import s from "./Actions.module.scss";

interface PropsI {
  handlePrev: () => void;
  handleNext: () => void;
  handleSkip: () => void;
  position: "start" | "middle" | "end";
  hideActions?: "skip"[];
}
export const Actions: React.FC<PropsI> = (props) => {
  const {
    handlePrev,
    handleNext,
    handleSkip,
    position,
    hideActions = [],
  } = props;
  const langPage = useAppSelector(getGuideModalLangPage);

  const isStart = position === "start";
  const isEnd = position === "end";

  const isHideSkip = hideActions.includes("skip");

  return (
    <div className={s.actions}>
      {!isStart && (
        <div className={s.back_button} onClick={handlePrev}>
          <ArrowRightSVG color={"white"} />
        </div>
      )}

      <div className={s.next_button} onClick={isEnd ? handleSkip : handleNext}>
        <div className={s.text}>
          {isEnd ? langPage.Actions.LetsStarted : langPage.Actions.Next}
        </div>
        <div className={s.icon}>
          <ArrowRightSVG />
        </div>
      </div>

      {isStart && !isHideSkip && (
        <div className={s.skip_button} onClick={handleSkip}>
          {langPage.Actions.Skip}
        </div>
      )}
    </div>
  );
};
