import { ColorItemI } from "../../../store/slices/ui/type";
import s from "./ColorSwitcher.module.scss";

interface PropsI {
  value: string;
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
      {listColors.map((color, index) => {


        let classItem = `${s.color}`
        if (color.value === value) classItem += ` ${s.active_color}`

        return (
          <div
            key={index}
            className={classItem}
            style={{
              backgroundColor: color.value,
            }}
            onClick={() => handleChange(color)}
          ></div>
        )
      })}
      <div className={s.text}>{value}</div>
    </div>
  );
};
