import s from "./CardContainerSoftware.module.scss";

interface PropsI {
  children?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  recommended?: boolean;
  style?: React.CSSProperties;
  className?: string;
  isPadding?: boolean;
}
export const CardContainerSoftware: React.FC<PropsI> = (props) => {
  const {
    children,
    active,
    disabled,
    onClick,
    style,
    recommended,
    className,
    isPadding = true,
  } = props;

  let containerClassName = `
  ${s.container} 
  ${disabled ? s.container_disabled : ""}
  ${active ? s.container_active : ""}
  ${className}
  `;

  if (isPadding) containerClassName += ` ${s.isPadding}`;

  return (
    <div className={containerClassName} style={style}>
      <button
        className={`${s.button} ${active ? s.button_active : ""}`}
        onClick={() => onClick}
      ></button>
      <div onClick={() => onClick()} className={s.wrapper}>
        {children}
      </div>
      {recommended && (
        <div className={s.recommended}>
          <div className={s.text}>recommended</div>
        </div>
      )}
    </div>
  );
};
