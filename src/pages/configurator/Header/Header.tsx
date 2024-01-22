import { NavigationMenu } from "../../../components/NavigationMenu/NavigationMenu";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getIsBuilding,
} from "../../../store/slices/ui/selectors/selectors";
import s from "./Header.module.scss";

export const Header: React.FC = () => {
  const activeStep = useAppSelector(getActiveStep);
  const isBuilding = useAppSelector(getIsBuilding);

  if (!activeStep) return null;

  if (isBuilding) {
    return (
      <div className={s.container}>
        <div className={s.navigationMenu}>
          <NavigationMenu />
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.navigationMenu}>
        <NavigationMenu />
      </div>
      <div className={s.title}>
        <div className={s.title_text}>{activeStep.title}</div>
        <div className={s.sub_title_text}>{activeStep.subtitle}</div>
      </div>
    </div>
  );
};
