import { styled } from 'styled-components';

import type { IconProps } from './types.js';

const Path = styled.path`
  fill: black;
`;

export const Fullscreen = (props: IconProps) => {
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
        d="M8.58823 4H2V8.41176L3.6 8.41V5.5H8.58823V4ZM18 4H11.4117V5.5H16.4V8.41176H18V7.52941V5.76471V4ZM8.58828 16.353H2.00005V14.5883V12.8236V11.9412H3.6V14.85H8.58828V16.353ZM11.4118 16.353H18V11.9412H16.4V14.85H11.4118V16.353Z"
      />
    </svg>
  );
};

Fullscreen.iconName = 'fullscreen';

export default Fullscreen;
