import { styled } from 'styled-components';

export const Wrapper = styled.div`
  background: #fff;
  color: #444;
  height: 32px;
  padding: 0px 12px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  margin-top: 12px;

  display: flex;
  flex-direction: row;

  user-select: none;

  & > div:nth-child(2) {
    height: max-content;
  }

  & > div {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const IconWrapper = styled.div`
  height: 16px;
  width: max-content;
  margin-right: 8px;
  overflow: hidden;
`;
