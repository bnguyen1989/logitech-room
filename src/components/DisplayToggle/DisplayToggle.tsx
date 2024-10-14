import { useDispatch } from "react-redux";
import { DisplaySVG } from "../../assets";
import { TVName } from "../../utils/permissionUtils";
import s from "./DisplayToggle.module.scss";
import { changeDisplayType } from "../../store/slices/ui/Ui.slice";
import { getDisplayType } from "../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../hooks/redux";
interface PropsI {
  disabled?: boolean;
}
export const DisplayToggle: React.FC<PropsI> = (props) => {
  const { disabled } = props;
  const dispatch = useDispatch();
  const typeDisplay = useAppSelector(getDisplayType);

  const handleChange = (displayName: TVName) => {
    if (disabled) return;
    dispatch(changeDisplayType(displayName));
  };

  const data = [
    {
      key: TVName.LogitechTVOne,
      icon: <DisplaySVG type={"single"} />,
      text: "Single",
    },
    {
      key: TVName.LogitechTVTwo,
      icon: <DisplaySVG type={"double"} />,
      text: "Dual",
    },
  ];

  const isActive = (key: TVName) => key === typeDisplay;

  return (
    <div
      className={`${s.container_display_toggle} ${disabled ? s.disabled : ""}`}
    >
      {data.map((item) => (
        <div
          className={`${s.button} ${isActive(item.key) ? s.button_active : ""}`}
          onClick={() => handleChange(item.key)}
        >
          <div className={s.icon}>{item.icon}</div>
          <div className={s.text}>{item.text}</div>
        </div>
      ))}
    </div>
  );
};
