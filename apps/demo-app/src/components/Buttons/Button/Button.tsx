import s from './Button.module.scss';

interface PropsI {
  text: string;
  onClick: () => void;
  variant?: 'outlined' | 'contained';
  style?: React.CSSProperties;
}
export const Button: React.FC<PropsI> = (props) => {
  const { onClick, text, variant = 'outlined', style } = props;
  return (
    <button
      className={`${s.button} ${s['button_' + variant]}`}
      onClick={() => onClick()}
      style={style}
    >
      {text}
    </button>
  );
};
