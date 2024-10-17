import { DisplaySVG } from "../../../assets";
import { TVName } from "../../../utils/permissionUtils";
import s from "./DisplayToggle.module.scss";
import {
  getActiveStep,
  getDisplayType,
  getPropertyDisplayCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";
import { getCardLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
  disabled?: boolean;
}
export const DisplayToggle: React.FC<PropsI> = (props) => {
  const { keyItemPermission, disabled } = props;
  const activeStep = useAppSelector(getActiveStep);
  const typeDisplay = useAppSelector(getDisplayType);
  const display = useAppSelector(
    getPropertyDisplayCardByKeyPermission(activeStep, keyItemPermission)
  );
  const langCard = useAppSelector(getCardLangPage);

  const handleChange = (displayName: TVName) => {
    if (disabled) return;
    app.changeDisplayItemConfiguration(displayName, keyItemPermission);
  };

  const data = [
    {
      key: TVName.LogitechTVOne,
      icon: <DisplaySVG type={"single"} />,
      text: langCard.Display.Single,
    },
    {
      key: TVName.LogitechTVTwo,
      icon: <DisplaySVG type={"double"} />,
      text: langCard.Display.Dual,
    },
  ];

  const isActive = (key: TVName) => key === (display ?? typeDisplay);

  return (
    <div
      className={`${s.container_display_toggle} ${disabled ? s.disabled : ""}`}
    >
      {data.map((item) => (
        <div
          className={`${s.button} ${isActive(item.key) ? s.button_active : ""}`}
          onClick={() => handleChange(item.key)}
        >
          <div className={`${s.icon} ${s[item.text.toLowerCase()]}`}>{item.icon}</div>
          <div className={s.text}>{item.text}</div>
        </div>
      ))}
    </div>
  );
};
