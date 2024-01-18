import { Button, BUTTON_TYPES } from './button.styles.js';
export { BUTTON_TYPES } from './button.styles.js';

export interface ButtonProps {
  style?: React.CSSProperties;
  type?: BUTTON_TYPES;
  dataId?: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const ButtonComponent = (props: ButtonProps) => {
  const {
    type = BUTTON_TYPES.default,
    children,
    dataId,
    style,
    onClick
  } = props;
  return (
    <Button
      type="button"
      style={style}
      buttonType={type}
      data-id={dataId}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
