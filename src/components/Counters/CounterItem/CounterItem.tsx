import { Counter } from "../Counter/Counter";
import s from "./CounterItem.module.scss";

interface PropsI {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
export const CounterItem: React.FC<PropsI> = (props) => {
  const { min, max, onChange, value, disabled } = props;

  return (
    <div className={s.container}>
      <Counter
        min={min}
        max={max}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
      <div className={s.text}>Max ({max})</div>
    </div>
  );
};
