import { ArrowRightSVG } from "../../../../assets";
import s from "./Actions.module.scss";

interface PropsI {
  handlePrev: () => void;
  handleNext: () => void;
  handleSkip: () => void;
  position: "start" | "middle" | "end";
}
export const Actions: React.FC<PropsI> = (props) => {
  const { handlePrev, handleNext, handleSkip, position } = props;
  const isStart = position === "start";
  const isEnd = position === "end";

  return (
    <div className={s.actions}>
      {!isStart && (
        <div className={s.back_button} onClick={handlePrev}>
          <ArrowRightSVG color={"white"} />
        </div>
      )}

      <div className={s.next_button} onClick={isEnd ? handleSkip : handleNext}>
        <div className={s.text}>{isEnd ? "Let's get started" : "Next"}</div>
        <div className={s.icon}>
          <ArrowRightSVG />
        </div>
      </div>

      {isStart && (
        <div className={s.skip_button} onClick={handleSkip}>
          Skip, I got this!
        </div>
      )}
    </div>
  );
};
