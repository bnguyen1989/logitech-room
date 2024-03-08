import { NavigationMenu } from "../../../components/NavigationMenu/NavigationMenu";
import { useAppSelector } from "../../../hooks/redux";
import { getIsBuilding } from "../../../store/slices/configurator/selectors/selectors";
import {
  getActiveStepData,
  getIsProcessInitData,
} from "../../../store/slices/ui/selectors/selectors";
import s from "./Header.module.scss";

export const Header: React.FC = () => {
  const activeStepData = useAppSelector(getActiveStepData);
  const isBuilding = useAppSelector(getIsBuilding);
  const isProcessInitData = useAppSelector(getIsProcessInitData);

  const isConferenceCamera = activeStepData.name
    .toLocaleLowerCase()
    .includes("conference camera");

  if ((isBuilding && isConferenceCamera) || isProcessInitData) {
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
        <div className={s.title_text}>{activeStepData.title}</div>
        <div
          className={s.sub_title_text}
          dangerouslySetInnerHTML={{ __html: activeStepData.subtitle }}
        ></div>
      </div>
    </div>
  );
};
