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

interface PropsI {}
export const Content: React.FC<PropsI> = () => {
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isBuilding = useAppSelector(getIsBuilding);
  const isStepConfigurator = useAppSelector(getIsConfiguratorStep);

  const handleNext = () => {
    if (!nextStep) return;
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
        <Button onClick={handleBack} text="Back" />
        <Button
          onClick={handleNext}
          text="Next"
          variant="contained"
          disabled={!activeStep?.currentCard && !isStepConfigurator}
        />
      </div>
    </div>
  );
};
