import { DisplaySVG } from "../../assets";
import s from "./DisplayToggle.module.scss";
interface PropsI {}
export const DisplayToggle: React.FC<PropsI> = () => {
  return (
    <div className={s.container_display_toggle}>
      <div className={s.button}>
        <div className={s.icon}>
          <DisplaySVG type={"single"} />
        </div>
				<div className={s.text}>Single</div>
      </div>
      <div className={`${s.button} ${s.button_active}`}>
        <div className={s.icon}>
          <DisplaySVG type={"double"} />
        </div>
				<div className={s.text}>Dual</div>
      </div>
    </div>
  );
};
