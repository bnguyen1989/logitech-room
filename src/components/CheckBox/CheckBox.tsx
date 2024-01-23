import s from "./CheckBox.module.scss";

interface PropsI {
  value?: boolean;
  onChange?: (value: boolean) => void;
  text: string;
}
export const CheckBox: React.FC<PropsI> = (props) => {
  const { value, onChange, text } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return;
    }
    onChange(e.target.checked);
  };
  return (
    <div className={s.container}>
      <input type="checkbox" checked={value} onChange={handleChange} />
      <div className={s.checkmark}></div>
      <label
        className={s.text}
        htmlFor="custom_checkbox"
        dangerouslySetInnerHTML={{ __html: text }}
      ></label>
    </div>
  );
};
