import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const Path = styled.path`
  stroke: #333;
  stroke-width: 2;
`;

export const Add = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M10 2V18M18 10H2" />
    </svg>
  );
};

Add.iconName = 'add';

export default Add;
