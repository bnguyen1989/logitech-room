import { styled } from 'styled-components';

const HEIGHT = '24px';

export const Wrapper = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  display: none;

  &:checked + label {
    background: ${(props) => props.theme.primaryColor};
  }

  &:checked + label:after {
    left: calc(100% - (0.1 * ${HEIGHT}));
    transform: translateX(-100%);
  }
`;

export const Label = styled.label`
  cursor: pointer;
  text-indent: -9999px;
  width: calc(2 * ${HEIGHT});
  height: ${HEIGHT};
  background: grey;
  display: block;
  border-radius: ${HEIGHT};
  position: relative;
  transition: all 0.2s;

  &:after {
    content: '';
    position: absolute;
    top: calc(0.1 * ${HEIGHT});
    left: calc(0.1 * ${HEIGHT});
    width: calc(0.8 * ${HEIGHT});
    height: calc(0.8 * ${HEIGHT});
    background: #fff;
    border-radius: calc(0.8 * ${HEIGHT});
    transition: 0.3s;
  }

  &:active:after {
    width: calc(1.3 * ${HEIGHT});
  }
`;
