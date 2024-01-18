import { styled } from 'styled-components';

export const Wrapper = styled.div`
  height: max-content;
  width: max-content;
  border-radius: 6px;
  padding: 2px;
  color: rgba(0, 0, 0, 0.65);
  background: #f5f5f5;
  transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
  display: flex;
  flex-direction: row;

  position: relative;
`;

export const Slider = styled.div`
  min-height: 28px;
  line-height: 28px;
  padding: 0 10px;
  background: #fff;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  /* color: rgba(0, 0, 0, 0.88); */
  border-radius: 3px;

  /* left: 100px; */
  position: absolute;
  transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export const Option = styled.div<{ selected?: boolean }>`
  min-height: 28px;
  line-height: 28px;
  padding: 0 10px;
  z-index: 2;
  cursor: pointer;
  position: relative;
  user-select: none;

  &:hover {
    color: rgba(0, 0, 0, 0.8);
  }
`;
