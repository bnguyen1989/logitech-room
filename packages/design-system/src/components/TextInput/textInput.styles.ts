import { styled } from 'styled-components';

export const TextInput = styled.input`
  width: 100%;
  margin: 0;
  padding: 8px 7px;
  background: #fff;
  border: 1px solid #d9d9d9;
  outline: none;
  border-radius: 2px;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    border: 1px solid ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 2px ${(props) => props.theme.primaryColor}28;
  }
`;
