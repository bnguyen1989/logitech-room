import { styled } from 'styled-components';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  user-select: none;

  & > div {
    height: max-content;
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    margin-left: 8px;
  }

  & > div:first-child {
    margin-left: 0px;
  }

  & > div:nth-child(3) {
    width: 120px;
  }
`;

export const AutoSaveLabel = styled.div<{ active: boolean }>`
  color: ${(props) => (props.active ? props.theme.primaryColor : '#333')};
`;

export const SaveButtonWrapper = styled.div<{ show: boolean }>`
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transition: all 0.2s;
`;
