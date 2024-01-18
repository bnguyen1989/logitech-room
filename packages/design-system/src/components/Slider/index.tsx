import { Input, Line, LineFill, Thumb, Wrapper } from './slider.styles.js';

interface SliderProps {
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const Slider = (props: SliderProps) => {
  const { value, step = 1, min = 0, max = 100, onChange } = props;

  const position = (value / (max - min)) * 100;

  return (
    <Wrapper>
      <Thumb left={`${position}%`}>{value}</Thumb>
      <Line>
        <LineFill width={`${position}%`}></LineFill>
      </Line>
      <Input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </Wrapper>
  );
};

export default Slider;
