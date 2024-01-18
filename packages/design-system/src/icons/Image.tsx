import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const Path = styled.path`
  stroke: #333;
  stroke-width: 1;
`;

const Rect = styled.rect`
  stroke: #333;
  stroke-width: 2;
`;

const Circle = styled.circle`
  stroke: #333;
  stroke-width: 1;
`;

export const Image = (props: IconProps) => {
  const { width, height, size } = props;
  return (
    <svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '20'}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="3" y="3" width="14" height="14" />
      <Path d="M3 14.5L8.5 9L12.5 13L14.5 11L17 13.5" />
      <Circle cx="13" cy="7" r="1.5" />
    </svg>
  );
};

Image.iconName = 'image';

export default Image;
