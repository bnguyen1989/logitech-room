import type React from 'react';
import { useEffect, useState } from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md/index.js';
import { styled } from 'styled-components';

import { ButtonBase } from './ButtonBase.js';

type FullScreenButtonProps = {
  targetDiv: React.RefObject<HTMLDivElement>;
  fgColor: string;
};

const BottomRightViewerButton = styled(ButtonBase)`
  bottom: 0px;
  right: 0px;
`;

export const FullscreenToggle: React.FC<FullScreenButtonProps> = ({
  targetDiv,
  fgColor
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => {
    if (targetDiv.current && targetDiv.current.requestFullscreen) {
      targetDiv.current.requestFullscreen();
    }
  };

  const closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <BottomRightViewerButton
      onClick={() => {
        document.fullscreenElement ? closeFullscreen() : openFullscreen();
      }}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      tabIndex={3}
    >
      {isFullscreen ? (
        <MdFullscreenExit className={`text-${fgColor}`} size="2em" />
      ) : (
        <MdFullscreen className={`text-${fgColor}`} size="2em" />
      )}
    </BottomRightViewerButton>
  );
};
