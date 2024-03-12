import s from "./ColorItem.module.scss";
import { ColorItemI } from "../../store/slices/ui/type";
import {
  getActiveStep,
  getCardByKeyPermission,
  getPropertyColorCardByKeyPermission,
} from "../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../hooks/redux";
import { Application } from "../../models/Application";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
}
export const ColorItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const colorValue = useAppSelector(
    getPropertyColorCardByKeyPermission(activeStep, keyItemPermission)
  );
  

  if (!card || !card.color || !!colorValue) return;

  const handleChange = (value: ColorItemI) => {
    app.changeColorItemConfiguration(value.name, card.keyPermission);
  };

  return (
    <div className={s.container}>
      {card.color.colors.map((color, index) => (
        <div
          key={index}
          className={`${s.color} ${
            color.name === colorValue ? s.active_color : ""
          }`}
          style={{
            backgroundColor: color.value,
          }}
          onClick={() => handleChange(color)}
        ></div>
      ))}
      <div className={s.text}>{colorValue}</div>
    </div>
  );
};
