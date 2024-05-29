import s from "./Button.module.scss";

interface PropsI {
  text: string;
  onClick: () => void;
  variant?: "outlined" | "contained";
  style?: React.CSSProperties;
  disabled?: boolean;
}
export const Button: React.FC<PropsI> = (props) => {
  const { onClick, text, variant = "outlined", style, disabled } = props;
  return (
    <div
      className={`${s.button} ${s["button_" + variant]} ${
        disabled ? s.disabled : ""
      }`}
      onClick={() => onClick()}
      style={style}
    >
      {text}
    </div>
  );
};
