import { useState } from "react";
import s from "./ColorItem.module.scss";

const listColors: Array<ColorI> = [
	{
		name: "Graphite",
		value: "#434446",
	},
	{
		name: "White",
		value: "#FBFBFB",
	},
];

interface ColorI {
	name: string;
	value: string;
}

interface PropsI {
  onChange: (value: ColorI) => void;
}
export const ColorItem: React.FC<PropsI> = (props) => {
  const { onChange } = props;
  const [value, setValue] = useState<ColorI>(listColors[0]);

  const handleChange = (value: ColorI) => {
    setValue(value);
    onChange(value);
  };
  return (
    <div className={s.container}>
      {listColors.map((color, index) => (
        <div
          key={index}
          className={`${s.color} ${color.value === value.value ? s.active_color : ""}`}
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
