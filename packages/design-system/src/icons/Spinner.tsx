import { keyframes, styled } from 'styled-components';

interface ISpinnerProps {
  size?: string;
  thickness?: string;
}

function Spinner(props: ISpinnerProps) {
  return <Wrapper size={props.size} thickness={props.thickness} />;
}

const spin = keyframes`
to {
    transform: rotate(360deg);
}
`;

const Wrapper = styled.div<ISpinnerProps>`
  display: inline-block;
  width: ${(props) => props.size || '16px'};
  height: ${(props) => props.size || '16px'};
  border: ${(props) => props.thickness || '3px'} solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #000;
  animation: ${spin} 1s ease-in-out infinite;
`;

Spinner.iconName = 'spinner';
export default Spinner;
