import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const Path = styled.path`
  stroke: #333;
  stroke-width: 2;
`;

export const CaretLeft = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M13.5 3L6.5 10L13.5 17" />
    </svg>
  );
};

CaretLeft.iconName = 'caret-left';

export default CaretLeft;
