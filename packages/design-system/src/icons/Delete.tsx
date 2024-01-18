import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const PathThick = styled.path`
  stroke: #333;
  stroke-width: 2;
`;

const PathThin = styled.path`
  stroke: #333;
  stroke-width: 1;
`;

export const Delete = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <PathThick d="M5 5C5 5 5 16 5 17C5 18 5 18 6 18C7 18 13 18 14 18C15 18 15 18 15 17C15 16 15 5 15 5" />
      <PathThick
        d="M3 3C3 3 6.65685 3 9 3M17 3C17 3 13.3431 3 11 3M9 3C9 2 9 2 10 2C11 2 11 2 11 3M9 3C9.78105 3 10.219 3 11 3"
        strokeLinecap="round"
      />
      <PathThin d="M8.5 14.5V6.5M11.5 14.5V6.5" strokeLinecap="round" />
    </svg>
  );
};

Delete.iconName = 'delete';

export default Delete;
