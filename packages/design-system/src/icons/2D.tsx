import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const Path = styled.path`
  fill: black;
`;

export const Player2D = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7145 8.42866C13.898 8.42866 14.8574 7.46927 14.8574 6.2858C14.8574 5.10233 13.898 4.14294 12.7145 4.14294C11.5311 4.14294 10.5717 5.10233 10.5717 6.2858C10.5717 7.46927 11.5311 8.42866 12.7145 8.42866ZM12.7145 7.42866C13.3457 7.42866 13.8574 6.91698 13.8574 6.2858C13.8574 5.65462 13.3457 5.14294 12.7145 5.14294C12.0834 5.14294 11.5717 5.65462 11.5717 6.2858C11.5717 6.91698 12.0834 7.42866 12.7145 7.42866Z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 2H17V17H2V2ZM3 3H16V13.4054L13.3037 9.81031L10.6125 12.5015L6.27977 7.08564L3 11.3025V3ZM3 12.9313V16H16V15.0721L13.1955 11.3327L10.5296 13.9987L6.29083 8.70025L3 12.9313Z"
      />
    </svg>
  );
};

Player2D.iconName = 'Player2d';

export default Player2D;
