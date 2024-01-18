import { styled } from 'styled-components';

export const Wrapper = styled.div`
  height: 32px;

  display: flex;
  flex-direction: row;

  & > div {
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    margin-left: 5px;
  }

  & > div:first-child {
    margin-left: 0px;
  }
`;

export const Label = styled.div`
  height: max-content;
`;

export const IconWrapper = styled.div`
  height: 16px;
`;
