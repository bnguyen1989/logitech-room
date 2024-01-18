import { styled } from 'styled-components';

export const Wrapper = styled.button`
  color: #000;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
  width: 38px;
  height: 38px;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  box-shadow: 0px 0px 4px 1px rgba(140, 140, 140, 0.25);
  transition: all 0.16s ease-in-out;
  & > svg {
    margin: auto;
  }
`;
