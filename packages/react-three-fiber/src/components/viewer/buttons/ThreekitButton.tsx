import { styled } from 'styled-components';

import { ThreekitIcon } from '../../icons/ThreekitIcon.js';
import { ButtonBase as ButtonBase } from './ButtonBase.js';

export type ThreekitButtonProps = {
  fgColor: string;
};

const TopLeftViewerButton = styled(ButtonBase)`
  top: 0px;
  left: 0px;
`;

export const ThreekitButton: React.FC<ThreekitButtonProps> = ({ fgColor }) => {
  return (
    <TopLeftViewerButton
      aria-label="Made by Threekit"
      tabIndex={1}
      onClick={() => {
        window.open('https://threekit.com', '_blank', 'noopener,noreferrer');
      }}
    >
      <ThreekitIcon className={`text-${fgColor}`} size="2em" />
    </TopLeftViewerButton>
  );
};
