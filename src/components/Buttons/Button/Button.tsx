import s from "./Button.module.scss";

interface PropsI {
  text: string;
  onClick: () => void;
  variant?: "outlined" | "contained" | "based";
  style?: React.CSSProperties;
  disabled?: boolean;
  dataAnalytics?: string;
}
export const Button: React.FC<PropsI> = (props) => {
  const {
    onClick,
    text,
    variant = "based",
    style,
    disabled,
    dataAnalytics,
  } = props;
  return (
    <div
      data-analytics-title={dataAnalytics}
      role={"button"}
      className={`${s.button} ${s["button_" + variant]} ${
        disabled ? s.disabled : ""
      } ${disabled ? s["disabled_" + variant] : ""}`}
      onClick={() => onClick()}
      style={style}
    >
      {text}
    </div>
  );
};
