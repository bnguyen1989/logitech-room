import { Label, Wrapper } from './switch.styles.js';

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  dataId?: string;
}

export const Switch = (props: SwitchProps) => {
  const { value, onChange, dataId } = props;
  return (
    <>
      <Wrapper
        type="checkbox"
        id="switch"
        data-id={dataId}
        checked={value}
        onChange={() => onChange?.(!value)}
      />
      <Label htmlFor="switch">Switch</Label>
    </>
  );
};

export default Switch;
