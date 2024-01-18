import { useEffect, useRef } from 'react';

import { Option, Slider, Wrapper } from './radioGroup.styles.js';

interface RadioGroupProps {
  onChange: (value: string | number) => void;
  value?: string | number;
  values: Array<{
    label: string;
    value: string | number;
  }>;
}

const RadioGroup = (props: RadioGroupProps) => {
  const { values, value, onChange } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const selectedElRef = useRef<HTMLDivElement>(null);
  const sliderElRef = useRef<HTMLDivElement>(null);

  const selectedLabel = values.find((val) => val.value === value)?.label;

  useEffect(() => {
    if (!elRef.current || !selectedElRef.current || !sliderElRef.current)
      return;
    const { left } = elRef.current.getBoundingClientRect();
    const { left: leftDelta } = selectedElRef.current.getBoundingClientRect();
    const delta = leftDelta - left;
    sliderElRef.current.style.left = `${delta}px`;
  }, [JSON.stringify(values), value]);

  return (
    <Wrapper ref={elRef}>
      <Slider ref={sliderElRef}>{selectedLabel}</Slider>
      {values.map((val) => (
        <Option
          onClick={() => onChange(val.value)}
          ref={val.value === value ? selectedElRef : undefined}
        >
          {val.label}
        </Option>
      ))}
    </Wrapper>
  );
};

export default RadioGroup;
