import { TextArea } from './textArea.styles.js';

export interface TextAreaProps {
  style?: React.CSSProperties;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  dataId: string;
}

export const TextAreaComponent = (props: TextAreaProps) => {
  const { placeholder, value, onChange, dataId, style } = props;
  return (
    <TextArea
      style={style}
      data-id={dataId}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

export default TextAreaComponent;
