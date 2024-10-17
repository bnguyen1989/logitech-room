import { DisplaySVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getActiveStep } from "../../../store/slices/ui/selectors/selectors";
import { getRecommendedDisplayByKeyPermission } from "../../../store/slices/ui/selectors/selectorsPermission";
import { TVName } from "../../../utils/permissionUtils";
import s from "./RecommendedDisplay.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const RecommendedDisplay: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const recommendedDisplay = useAppSelector(
    getRecommendedDisplayByKeyPermission(activeStep, keyItemPermission)
  );

  const keys = Object.keys(recommendedDisplay).filter(
    (key) => recommendedDisplay[key]
  );

  if (!keys.length) return null;

  const data: Record<
    string,
    {
      icon: JSX.Element;
      text: string;
    }
  > = {
    [TVName.LogitechTVOne]: {
      icon: <DisplaySVG type={"single"} />,
      text: "Best for single display",
    },
    [TVName.LogitechTVTwo]: {
      icon: <DisplaySVG type={"double"} />,
      text: "Best for dual display",
    },
  };

  const keyDisplay = keys[0];

  return (
    <div className={s.recommended_display}>
      <div className={s.icon}>{data[keyDisplay].icon}</div>
      <div className={s.text}>{data[keyDisplay].text}</div>
    </div>
  );
};
