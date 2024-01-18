import { styled } from 'styled-components';

export const NumberInput = styled.input`
  width: 100%;
  margin: 0;
  padding: 8px 7px;
  background: #fff;
  border: none;
  outline: none;
  font-size: 14px;
  transition: all 0.3s;
`;

export const ActionArea = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  opacity: 0;
  transition: all 0.2s;

  button {
    outline: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #39ad89;
    }
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: row;
  border: 1px solid #d9d9d9;
  border-radius: 2px;

  &:hover {
    ${ActionArea} {
      opacity: 1;
    }
  }
`;
