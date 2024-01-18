import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const ThinCircle = styled.circle`
  stroke-width: 1;
  stroke: #333;
`;

const ThickCircle = styled.circle`
  stroke-width: 2;
  stroke: #333;
`;

const Path = styled.path`
  stroke-width: 1;
  stroke: #333;
`;

export const Info = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ThickCircle cx="10" cy="10" r="8" />
      <ThinCircle cx="10" cy="6" r="0.5" />
      <Path d="M8 8.5H9.5M10.5 14.5V8.5H9.5M10.5 14.5H9.5M10.5 14.5H12M9.5 14.5V8.5M9.5 14.5H8" />
    </svg>
  );
};

Info.iconName = 'info';

export default Info;
