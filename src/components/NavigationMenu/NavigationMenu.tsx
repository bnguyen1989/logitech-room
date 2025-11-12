import s from "./NavigationMenu.module.scss";
import { useAppSelector } from "../../hooks/redux";
import {
  getActiveStepData,
  getStepData,
} from "../../store/slices/ui/selectors/selectors";
import { StepI } from "../../store/slices/ui/type";
import { getNameStepByStepName } from "../../store/slices/ui/selectors/selectoteLangPage";

export const NavigationMenu: React.FC = () => {
  const dataStep = useAppSelector(getStepData);
  const activeStepData = useAppSelector(getActiveStepData);
  
  // Early return if data not ready
  if (!dataStep || !activeStepData || !activeStepData.key) {
    return null;
  }
  
  const langNameStep = useAppSelector(
    getNameStepByStepName(activeStepData.key)
  );

  const isActive = (step: StepI) => {
    return step.name === activeStepData.name;
  };

  const listDataStep = Object.values(dataStep || {});

  return (
    <div className={s.container}>
      <div className={s.name}>{langNameStep || ""}</div>
      <div className={s.menu}>
        {listDataStep.map((item, index) => (
          <div key={index} className={s.wrapper}>
            <div className={s.item}>
              <div
                className={isActive(item) ? s.out_circle_active : s.out_circle}
              >
                <div
                  className={isActive(item) ? s.in_circle_active : s.in_circle}
                ></div>
              </div>
            </div>
            {index !== listDataStep.length - 1 && (
              <div className={s.divider}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
