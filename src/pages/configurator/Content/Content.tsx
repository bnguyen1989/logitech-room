import s from "./Content.module.scss";
import { Button } from "../../../components/Buttons/Button/Button";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getIsConfiguratorStep,
  getNavigationStepData,
} from "../../../store/slices/ui/selectors/selectors";
import React from "react";
import { useDispatch } from "react-redux";
import { changeActiveStep } from "../../../store/slices/ui/Ui.slice";
import { Loader } from "../../../components/Loader/Loader";
import { PrepareSection } from "./PrepareSections/PrepareSection";
import { ConfiguratorSection } from "./ConfiguratorSections/ConfiguratorSection";
import { getIsBuilding } from "../../../store/slices/configurator/selectors/selectors";
import { changeStatusBuilding } from "../../../store/slices/configurator/Configurator.slice";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { RevertSVG } from "../../../assets";
import { setMySetupModal } from '../../../store/slices/modals/Modals.slice'

interface PropsI {}
export const Content: React.FC<PropsI> = () => {
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isBuilding = useAppSelector(getIsBuilding);
  const isStepConfigurator = useAppSelector(getIsConfiguratorStep);

  const handleNext = () => {
    if (!nextStep) {
      dispatch(setMySetupModal({ isOpen: true }));
      return;
    }
    const isConferenceCamera = nextStep.name
      .toLocaleLowerCase()
      .includes("conference camera");
    if (isConferenceCamera) {
      dispatch(changeStatusBuilding(true));
      setTimeout(() => {
        dispatch(changeStatusBuilding(false));
        dispatch(changeActiveStep(nextStep));
      }, 2000);
      return;
    }
    dispatch(changeActiveStep(nextStep));
  };

  const handleBack = () => {
    if (!prevStep) {
      dispatch(changeActiveStep(null));
      return;
    }
    dispatch(changeActiveStep(prevStep));
  };

  const handleRevert = () => {
    dispatch(changeActiveStep(null));
  }

  if (isBuilding) {
    return (
      <div className={s.container}>
        <div className={s.loader}>
          <Loader text="Building Your Room" />
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.content}>
        <PrepareSection />
        <ConfiguratorSection />
      </div>

      <div className={s.actions}>
        {!nextStep && (
          <IconButton text={"Start over"} onClick={handleRevert}>
            <RevertSVG />
          </IconButton>
        )}
        <Button onClick={handleBack} text="Back" />
        <Button
          onClick={handleNext}
          text={nextStep ? "Next" : 'Finish'}
          variant="contained"
          disabled={!activeStep?.currentCard && !isStepConfigurator}
        />
      </div>
    </div>
  );
};
