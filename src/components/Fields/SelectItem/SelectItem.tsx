import { useState } from "react";
import s from "./SelectItem.module.scss";

interface OptionI {
  label: string;
  value: string;
  threekit: { assetId: string };
}

interface PropsI {
  value: OptionI;
  onSelect: (option: OptionI) => void;
  options: Array<OptionI>;
  disabled?: boolean;
}
export const SelectItem: React.FC<PropsI> = (props) => {
  const { value, onSelect, options, disabled } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: OptionI) => {
    onSelect(option);
    setIsOpen(false);
  };

  const toggleSelect = () => {
    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const isActive = (currentValue: OptionI) => {
    return value?.value === currentValue.value;
  };

  return (
    <div
      className={`${s.container} ${isOpen ? s.active : ""} ${
        disabled ? s.container_disabled : ""
      }`}
      onClick={toggleSelect}
    >
      <div className={s.value}>{value.label}</div>
      <div className={s.icon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.13647 9.3355L4.49997 5.6985L3.79297 6.4055L8.13647 10.75L12.4995 6.38651L11.7925 5.67951L8.13647 9.3355Z"
            fill="black"
          />
          <mask
            id="mask0_4571_7341"
            maskUnits="userSpaceOnUse"
            x="3"
            y="5"
            width="10"
            height="6"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.13647 9.3355L4.49997 5.6985L3.79297 6.4055L8.13647 10.75L12.4995 6.38651L11.7925 5.67951L8.13647 9.3355Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_4571_7341)"></g>
        </svg>
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
