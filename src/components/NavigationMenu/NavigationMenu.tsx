import s from './NavigationMenu.module.scss';
import { useAppSelector } from '../../hooks/redux'
import { getActiveStep, getStepData } from '../../store/slices/ui/selectors/selectors'
import { StepCardType, StepI } from '../../store/slices/ui/type'


export const NavigationMenu: React.FC = () => {
  const dataStep = useAppSelector(getStepData);
  const activeStep = useAppSelector(getActiveStep);

  if (!activeStep) return null;

  const isActive = (step: StepI<StepCardType>) => {
    return step.name === activeStep.name;
  };

  const listDataStep = Object.values(dataStep);

  return (
    <div className={s.container}>
      <div className={s.name}>{activeStep.name}</div>
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
            {index !== listDataStep.length - 1 && <div className={s.divider}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
