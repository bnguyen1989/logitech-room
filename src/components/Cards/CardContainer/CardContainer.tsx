import s from "./CardContainer.module.scss";

interface PropsI {
  children?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  recommended?: boolean;
  style?: React.CSSProperties;
}
export const CardContainer: React.FC<PropsI> = (props) => {
  const { children, active, disabled, onClick, style, recommended } = props;
  return (
    <div
      className={`
      ${s.container} 
      ${disabled ? s.container_disabled : ""}
      ${active ? s.container_active : ""}
      `}
      style={style}
    >
      <button
        className={`${s.button} ${active ? s.button_active : ""}`}
        onClick={onClick}
      ></button>
      <div className={s.wrapper}>{children}</div>
      {recommended && (
        <div className={s.recommended}>
          <div className={s.text}>recommended</div>
        </div>
      )}
    </div>
  );
};
