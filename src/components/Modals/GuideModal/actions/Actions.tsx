import { ArrowRightSVG } from "../../../../assets";
import s from "./Actions.module.scss";

export const Actions = () => {
  return (
    <div className={s.actions}>
      <div className={s.back_button}>
        <ArrowRightSVG color={"white"} />
      </div>
      <div className={s.next_button}>
        <div className={s.text}>Next</div>
        <div className={s.icon}>
          <ArrowRightSVG />
        </div>
      </div>

      <div className={s.skip_button}>Skip, I got this!</div>
    </div>
  );
};
