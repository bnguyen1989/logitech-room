import { styled } from 'styled-components';

export const TextArea = styled.textarea`
  width: 100%;
  margin: 0;
  padding: 8px 7px;
  background: #fff;
  border: 1px solid #d9d9d9;
  outline: none;
  border-radius: 2px;
  font-size: 14px;
  transition: all 0.3s;

  &:active {
    border: 1px solid ${(props) => props.theme.primaryColor};
  }
`;
