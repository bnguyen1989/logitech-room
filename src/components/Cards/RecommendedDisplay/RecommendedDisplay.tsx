import { DisplaySVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getDisplayType,
} from "../../../store/slices/ui/selectors/selectors";
import { getRecommendedDisplayByKeyPermission } from "../../../store/slices/ui/selectors/selectorsPermission";
import { TVName } from "../../../utils/permissionUtils";
import s from "./RecommendedDisplay.module.scss";

interface PropsI {
  keyItemPermission: string;
}
export const RecommendedDisplay: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const displayType = useAppSelector(getDisplayType);
  const recommendedDisplay = useAppSelector(
    getRecommendedDisplayByKeyPermission(activeStep, keyItemPermission)
  );

  const isShowRecommendedDisplay =
    recommendedDisplay && displayType && recommendedDisplay[displayType];

  if (!isShowRecommendedDisplay) return null;

  const data = {
    [TVName.LogitechTVOne]: {
      icon: <DisplaySVG type={"single"} />,
      text: "Best for single display",
    },
    [TVName.LogitechTVTwo]: {
      icon: <DisplaySVG type={"double"} />,
      text: "Best for dual display",
    },
  };

  return (
    <div className={s.recommended_display}>
      <div className={s.icon}>{data[displayType].icon}</div>
      <div className={s.text}>{data[displayType].text}</div>
    </div>
  );
};
