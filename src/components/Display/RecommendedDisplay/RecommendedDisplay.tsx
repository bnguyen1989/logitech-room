import { DisplaySVG } from "../../../assets";
import { useAppSelector } from "../../../hooks/redux";
import { getActiveStep } from "../../../store/slices/ui/selectors/selectors";
import { getRecommendedDisplayByKeyPermission } from "../../../store/slices/ui/selectors/selectorsPermission";
import { getCardLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";
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
  const langCard = useAppSelector(getCardLangPage);

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
      text: langCard.Display.ForSingle,
    },
    ["all"]: {
      icon: <DisplaySVG type={"all"} />,
      text: langCard.Display.ForAll,
    },
  };

  const keyDisplay = keys.length === 2 ? "all" : keys[0];
  const dataRecommended = data[keyDisplay];

  return (
    <div className={s.recommended_display}>
      <div className={s.icon}>{dataRecommended.icon}</div>
      <div className={s.text}>{dataRecommended.text}</div>
    </div>
  );
};
