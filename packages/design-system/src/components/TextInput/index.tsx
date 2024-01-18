import { TextInput } from './textInput.styles.js';

export interface TextInput {
  style?: React.CSSProperties;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  dataId: string;
}

export const TextInputComponent = (props: TextInput) => {
  const { type = 'text', placeholder, value, onChange, dataId, style } = props;
  return (
    <TextInput
      type={type}
      style={style}
      data-id={dataId}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInputComponent;
