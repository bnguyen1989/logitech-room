import { ColorItemI } from "../../../store/slices/ui/type";
import s from "./ColorSwitcher.module.scss";

interface PropsI {
  value: ColorItemI;
  onChange: (value: ColorItemI) => void;
  listColors: ColorItemI[];
}
export const ColorSwitcher: React.FC<PropsI> = (props) => {
  const { onChange, value, listColors } = props;

  const handleChange = (value: ColorItemI) => {
    onChange(value);
  };
  return (
    <div className={s.container}>
      {listColors.map((color, index) => (
        <div
          key={index}
          className={`${s.color} ${
            color.value === value.value ? s.active_color : ""
          }`}
          style={{
            backgroundColor: color.value,
          }}
          onClick={() => handleChange(color)}
        ></div>
      ))}
      <div className={s.text}>{value.name}</div>
    </div>
  );
};
