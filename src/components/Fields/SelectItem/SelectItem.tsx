import { useState } from "react";
import s from "./SelectItem.module.scss";
import {
  getActiveStep,
  getCardByKeyPermission,
  getPropertySelectValueCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";

declare const app: Application;

interface OptionI {
  label: string;
  value: string;
}

interface PropsI {
  keyItemPermission: string;
  disabled?: boolean;
  defaultLabel?: string;
}
export const SelectItem: React.FC<PropsI> = (props) => {
  const { disabled, keyItemPermission, defaultLabel } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const selectValue = useAppSelector(
    getPropertySelectValueCardByKeyPermission(activeStep, keyItemPermission)
  );

  if (!card || !card.select) return null;

  const handleSelect = (option: OptionI) => {
    const attributeName = card.dataThreekit.attributeName;
    const assetId = option.value;
    const keyPermission = card.keyPermission;

    app.changeSelectItemConfiguration(attributeName, assetId, keyPermission);

    setIsOpen(false);
  };

  const toggleSelect = (e: any) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const isActive = (currentValue: OptionI) => {
    return selectValue === currentValue.value;
  };

  const getName = () => {
    if (defaultLabel && !selectValue) {
      return defaultLabel;
    }
    return card.select?.data.find((item) => item.value === selectValue)?.label;
  };

  return (
    <div
      className={`${s.container} ${isOpen ? s.active : ""} ${
        disabled ? s.container_disabled : ""
      }`}
      onClick={toggleSelect}
    >
      <div className={s.value}>{getName()}</div>
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
          {card.select.data.map((option) => (
            <li
              className={`${s.li} ${isActive(option) ? s.active_li : ""}`}
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
