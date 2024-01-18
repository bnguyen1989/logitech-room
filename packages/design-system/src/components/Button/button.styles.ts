import { styled } from 'styled-components';

export enum BUTTON_TYPES {
  default = 'default',
  primary = 'primary',
  dashed = 'dashed',
  danger = 'danger',
  link = 'link',
  transparent = 'transparent',
  disabled = 'disabled'
}

interface IButtonStyleProps {
  buttonType: BUTTON_TYPES;
}

export const Button = styled.button<IButtonStyleProps>`
  line-height: 1.6;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: ${(props) =>
    props.buttonType === BUTTON_TYPES.disabled ? 'not-allowed' : 'pointer'};
  color: ${(props) =>
    props.buttonType === BUTTON_TYPES.primary
      ? '#fff'
      : props.buttonType === BUTTON_TYPES.disabled
      ? 'rgba(0, 0, 0, 0.25)'
      : 'rgba(0, 0, 0, 0.65)'};
  border-color: ${(props) =>
    props.buttonType === BUTTON_TYPES.primary
      ? props.theme.primaryColor
      : props.buttonType === BUTTON_TYPES.disabled
      ? '#d9d9d9'
      : '#d9d9d9'};
  background: ${(props) =>
    props.buttonType === BUTTON_TYPES.primary
      ? props.theme.primaryColor
      : props.buttonType === BUTTON_TYPES.disabled
      ? '#e1e1e1'
      : '#fff'};

  &:hover {
    color: ${(props) =>
      props.buttonType === BUTTON_TYPES.disabled
        ? 'rgba(0,0,0,0.25)'
        : props.theme.primaryColor};
    background: ${(props) =>
      props.buttonType === BUTTON_TYPES.disabled ? '#e1e1e1' : '#fff'};
    border-color: ${(props) =>
      props.buttonType === BUTTON_TYPES.disabled
        ? '#d9d9d9'
        : props.theme.primaryColor};
  }
`;
