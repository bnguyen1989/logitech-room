import s from "./CardContainer.module.scss";

interface PropsI {
  children?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  recommended?: boolean;
  style?: React.CSSProperties;
  isFullClick?: boolean;
  className?: string;
}
export const CardContainer: React.FC<PropsI> = (props) => {
  const {
    children,
    active,
    disabled,
    onClick,
    style,
    recommended,
    isFullClick,
    className,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFullClick) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  const containerClassName = `
  ${s.container} 
  ${disabled ? s.container_disabled : ""}
  ${active ? s.container_active : ""}
  ${className}
  `;

  return (
    <div className={containerClassName} style={style}>
      <button
        className={`${s.button} ${active ? s.button_active : ""}`}
        onClick={onClick}
      ></button>
      <div onClick={handleClick} className={s.wrapper}>
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
