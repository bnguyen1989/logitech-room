import React from 'react';

import FullscreenIcon from '../../icons/Fullscreen.js';
import ThreekitLogo from '../../icons/ThreekitLogo.js';
import { Wrapper } from './playerButton.styles.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  dataId?: string;
}

export const ButtonComponent = (props: ButtonProps) => {
  const { children, dataId } = props;
  return (
    <Wrapper {...props} type="button" data-id={dataId}>
      {children}
    </Wrapper>
  );
};

export const FullscreenPlayerButton = (
  props: Omit<ButtonProps, 'children'>
) => {
  return (
    <ButtonComponent onClick={props.onClick} dataId="fullscreen-btn">
      <FullscreenIcon />
    </ButtonComponent>
  );
};

export const ThreekitLogoButton = (props: Omit<ButtonProps, 'children'>) => {
  return (
    <ButtonComponent onClick={props.onClick} dataId="threekit-logo-btn">
      <ThreekitLogo />
    </ButtonComponent>
  );
};

export default ButtonComponent;
