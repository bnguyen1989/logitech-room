import { styled } from 'styled-components';

export const Wrapper = styled.div`
  height: 24px;
  min-width: 24px;
  width: max-content;
  background: red;
  border: 1px solid #fff;
  border-radius: 14px;
  color: white;
  font-size: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  z-index: 2;

  & > div {
    width: max-content;
    padding: 0 5px;
    margin: 0 auto;
  }
`;
