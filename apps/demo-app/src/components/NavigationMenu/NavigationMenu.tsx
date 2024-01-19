import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../hooks/redux.ts';
import {
  getActiveStep,
  getStepData
} from '../../store/slices/ui/selectors/selectors.ts';
import type { StepI } from '../../store/slices/ui/type.ts';
import { changeActiveStep } from '../../store/slices/ui/Ui.slice.ts';
import s from './NavigationMenu.module.scss';

export const NavigationMenu: React.FC = () => {
  const dispatch = useDispatch();
  const dataSteps = useAppSelector(getStepData);
  const activeStep = useAppSelector(getActiveStep);

  const handleClick = (step: StepI) => {
    dispatch(changeActiveStep(step));
  };

  const isActive = (step: StepI) => {
    return step.name === activeStep.name;
  };
  return (
    <div className={s.container}>
      <div className={s.name}>{activeStep.name}</div>
      <div className={s.menu}>
        {dataSteps.map((item: any, index: number) => (
          <div key={index} className={s.wrapper}>
            <div className={s.item}>
              <div
                className={isActive(item) ? s.out_circle_active : s.out_circle}
                onClick={() => handleClick(item)}
              >
                <div
                  className={isActive(item) ? s.in_circle_active : s.in_circle}
                ></div>
              </div>
            </div>
            {index !== dataSteps.length - 1 && (
              <div className={s.divider}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
