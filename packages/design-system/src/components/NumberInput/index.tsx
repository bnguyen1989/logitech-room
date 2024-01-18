import CaretDown from '../../icons/CaretDown.js';
import CaretUp from '../../icons/CaretUp.js';
import { ActionArea, NumberInput, Wrapper } from './numberInput.styles.js';

export interface NumberInput {
  style?: React.CSSProperties;
  placeholder: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  dataId: string;
}

export const NumberInputComponent = (props: NumberInput) => {
  const { placeholder, value, min, max, onChange, dataId, style } = props;

  const handleIncrement = () => {
    if (max && value === max) return;
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (typeof min === 'number' && value === min) return;
    onChange(value - 1);
  };

  return (
    <Wrapper>
      <NumberInput
        type="text"
        pattern="[0-9]*"
        style={style}
        data-id={dataId}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <ActionArea>
        <button type="button" data-id="decrement-btn" onClick={handleIncrement}>
          <CaretUp />
        </button>
        <button type="button" data-id="increment-btn" onClick={handleDecrement}>
          <CaretDown />
        </button>
      </ActionArea>
    </Wrapper>
  );
};

export default NumberInputComponent;
