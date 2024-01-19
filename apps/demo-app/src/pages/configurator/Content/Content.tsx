import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '../../../components/Buttons/Button/Button.tsx';
import { useAppSelector } from '../../../hooks/redux.ts';
import {
  getActiveStep,
  getNavigationStepData
} from '../../../store/slices/ui/selectors/selectors.ts';
import { changeActiveStep } from '../../../store/slices/ui/Ui.slice.ts';
import s from './Content.module.scss';

export const Content: React.FC = () => {
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);

  const handleNext = () => {
    if (!nextStep) return;
    dispatch(changeActiveStep(nextStep));
  };

  const handleBack = () => {
    if (!prevStep) {
      dispatch(changeActiveStep(null));
      return;
    }
    dispatch(changeActiveStep(prevStep));
  };

  return (
    <div className={s.container}>
      {activeStep?.component ? React.createElement(activeStep.component) : null}
      <div className={s.actions}>
        <Button onClick={handleBack} text="Back" />
        <Button onClick={handleNext} text="Next" variant="contained" />
      </div>
    </div>
  );
};
