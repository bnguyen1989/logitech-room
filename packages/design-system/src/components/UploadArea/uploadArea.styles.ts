import { styled } from 'styled-components';

interface UploadWrapperProps {
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export const UploadWrapper = styled.span<UploadWrapperProps>`
  position: relative;
  overflow: hidden;
  display: inline-block;

  & button {
    min-height: 40px;
    height: max-content;
    width: ${(props) =>
      props.fullWidth ? '100%' : props.iconOnly ? '40px' : 'max-content'};
    padding: ${(props) => (props.iconOnly ? '0px' : '10px 16px')};
    overflow: hidden;
    text-align: center;
    background: white;
    cursor: pointer;
    color: #333;
    border-radius: 2px;
    border: 1px solid #333;
    transition: all 0.16s ease-in-out;
  }

  & button:hover {
    border: 1px solid #888;
    color: #888;
  }

  & input[type='file'] {
    display: none;
  }
`;

export const UploadingWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 8px;

  & > div {
    height: max-content;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  img {
    height: 72px;
  }
`;
