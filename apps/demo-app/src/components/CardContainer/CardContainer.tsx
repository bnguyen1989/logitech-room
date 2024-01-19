import s from './CardContainer.module.scss';

interface PropsI {
  children?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
export const CardContainer: React.FC<PropsI> = (props) => {
  const { children, active, disabled, onClick } = props;
  return (
    <div className={`${s.container} ${disabled ? s.container_disabled : ''}`}>
      <button
        className={`${s.button} ${active ? s.button_active : ''}`}
        onClick={onClick}
      ></button>
      <div className={s.wrapper}>{children}</div>
    </div>
  );
};
