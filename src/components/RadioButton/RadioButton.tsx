import s from "./RadioButton.module.scss";

interface PropsI {
  onChange: (value: boolean) => void;
  value: boolean;
  text: string;
}
export const RadioButton: React.FC<PropsI> = (props) => {
  const { onChange, value, text } = props;

  const handleClick = () => {
    onChange(!value);
  };
  return (
    <div className={s.container} onClick={handleClick}>
      <div className={`${s.check} ${value ? s.check_active : ""}`}></div>
      <div className={s.text}>{text}</div>
    </div>
  );
};
