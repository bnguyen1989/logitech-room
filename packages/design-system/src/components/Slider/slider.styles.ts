import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const Input = styled.input`
  position: absolute;
  top: 50%;
  z-index: 3;
  transform: translateY(-50%);
  appearance: none;
  width: 100%;
  height: 4px;
  opacity: 0;
  margin: 0;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 100px;
    height: 100px;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0;
  }

  &::-moz-range-thumb {
    width: 14vmin;
    height: 14vmin;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0;
  }
`;

export const Thumb = styled.div<{ left: string }>`
  width: 36px;
  height: 36px;
  border: 3px solid #303030;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: ${(props) => props.left ?? 0};
  transform: translateX(-50%) translateY(-50%);
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 17px;
  color: #303030;
  z-index: 2;
  user-select: none;
`;

export const Line = styled.div`
  height: 3px;
  width: 100%;
  background-color: #e1e1e1;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  position: absolute;
  z-index: 1;
`;

export const LineFill = styled.div<{ width: string }>`
  position: absolute;
  height: 3px;
  width: ${(props) => props.width ?? 0};
  background-color: #303030;
`;
