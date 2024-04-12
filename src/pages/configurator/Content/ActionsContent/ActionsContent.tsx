import s from "./ActionsContent.module.scss";

import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { RevertSVG } from "../../../../assets";
import { Button } from "../../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMySetupModal } from "../../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getIsCanChangeStep,
  getNavigationStepData,
} from "../../../../store/slices/ui/selectors/selectors";
import { Application } from "../../../../models/Application";
import { DirectionStep } from "../../../../utils/baseUtils";

declare const app: Application;

export const ActionsContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isCanChangeStep = useAppSelector(getIsCanChangeStep);

  const handleNext = () => {
    if (!nextStep) {
      dispatch(setMySetupModal({ isOpen: true }));
      return;
    }

    app.changeStep(nextStep.key, DirectionStep.Next);
  };

  const handleBack = () => {
    if (!prevStep) {
      navigate("/", { replace: true });
      return;
    }

    app.changeStep(prevStep.key, DirectionStep.Prev);
  };

  const handleRevert = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className={s.actions}>
      {!nextStep && (
        <IconButton text={"Start over"} onClick={handleRevert}>
          <RevertSVG />
        </IconButton>
      )}
      <Button onClick={handleBack} text="Back" />
      <Button
        onClick={handleNext}
        text={nextStep ? "Next" : "Finish"}
        variant="contained"
        disabled={!isCanChangeStep}
      />
    </div>
  );
};
