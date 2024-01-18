import { styled } from 'styled-components';

interface WrapperProps {
  selected?: null | boolean;
}

interface InputProps {
  editable: boolean;
}

export const Wrapper = styled.li<WrapperProps>`
  display: grid;
  grid-template-columns: max-content max-content 1fr 1fr max-content;
  grid-gap: 10px;

  height: max-content;
  padding: 10px 20px;
  background: ${(props) =>
    props.selected ? 'rgba(132, 209, 176, 0.05)' : '#fff'};
  border: 2px solid ${(props) => (props.selected ? '#84d1b0' : '#fff')};
  border-radius: 5px;

  box-shadow: ${(props) =>
    props.selected ? 'none' : '1px 2px 4px rgba(0, 0, 0, 0.3)'};

  margin-bottom: 8px;

  transition: all 0.3s;
  user-select: none;
  cursor: ${(props) => (props.selected == null ? 'default' : 'grab')};

  & > div:nth-child(1) {
    cursor: grab;
  }

  & > div:nth-child(2) svg {
    color: #1ba17b;
  }

  & > div:nth-child(3) input {
    font-weight: 600;
  }

  & > div:last-child svg {
    color: #ff7875;
  }

  & > div:first-child,
  & > div:nth-child(2),
  & > div:last-child {
    max-height: 20px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  & > div:first-child,
  & > div:last-child {
    opacity: ${(props) => (props.selected ? 1 : 0)};
    transition: 0.2s;
  }

  &:hover {
    background: ${(props) =>
      props.selected == null
        ? 'rgba(132, 209, 176, 0.05)'
        : props.selected
        ? 'rgba(132, 209, 176, 0.05)'
        : '#fff'};
    border: 2px solid
      ${(props) =>
        props.selected == null
          ? '#84d1b0'
          : props.selected
          ? '#84d1b0'
          : '#fff'};

    & > div:first-child,
    & > div:last-child {
      opacity: ${(props) =>
        props.selected == null ? 1 : props.selected ? 1 : 0};
    }
  }
`;

export const Input = styled.input<InputProps>`
  box-sizing: border-box;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
  background-color: ${(props: InputProps) =>
    props.editable ? '#fff' : '#ffffff00'};
  background-image: none;
  border: ${(props: InputProps) =>
    props.editable ? '1px solid #d9d9d9' : '1px solid #fff'};
  border-radius: 2px;
  transition: all 0.3s;

  &:hover {
    ${(props: InputProps) => (props.editable ? 'border-color: #39AD89' : '')};
  }

  &:focus {
    border-color: #39ad89;
    box-shadow: 0 0 0 2px rgba(27, 161, 123, 0.2);
    border-right-width: 1px;
    outline: 0;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
`;
