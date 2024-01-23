import { ArrowDownSVG } from "../../../assets";
import s from "./Select.module.scss";
import React, { useState } from "react";

interface OptionI {
  label: string;
  value: string;
}

interface PropsI {
  options: Array<OptionI>;
  onSelect: (option: OptionI) => void;
  value?: OptionI;
	placeholder?: string;
	required?: boolean;
}
export const Select: React.FC<PropsI> = (props) => {
  const { options, onSelect, value, placeholder, required } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: OptionI) => {
    onSelect(option);
    setIsOpen(false);
  };

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (currentValue: OptionI) => {
    return value?.value === currentValue.value;
  };

	const textPlaceholder = required ? `${placeholder} *` : placeholder;

  return (
    <div
      className={`${s.container} ${isOpen ? s.active : ""}`}
      onClick={toggleSelect}
    >
      <div className={s.value}>
				{value ? <div>{value.label}</div> : <div>{textPlaceholder}</div>}
      </div>
      <div className={s.icon}>
        <ArrowDownSVG />
      </div>
      {isOpen && (
        <ul className={s.options}>
          {options.map((option) => (
            <li
              className={isActive(option) ? s.active_li : ""}
              key={option.value}
              onClick={() => handleSelect(option)}
            >
              <div className={s.text}>{option.label}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
