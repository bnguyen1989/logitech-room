import s from "./ActionsContent.module.scss";
import { Button } from "../../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFinishModal } from "../../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getIsCanChangeStep,
  getNavigationStepData,
} from "../../../../store/slices/ui/selectors/selectors";
import { Application } from "../../../../models/Application";
import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { BackMarkSVG } from "../../../../assets";
import {
  EventActionName,
  EventCategoryName,
} from "../../../../models/analytics/type";

declare const app: Application;

export const ActionsContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isCanChangeStep = useAppSelector(getIsCanChangeStep);

  const handleNext = () => {
    if (!nextStep) {
      dispatch(setFinishModal({ isOpen: true }));
      return;
    }

    app.analyticsEvent({
      category: EventCategoryName.threekit_configurator,
      action: EventActionName.step_complete,
      value: {},
    });

    app.changeStep(nextStep.key);
  };

  const handleBack = () => {
    if (!prevStep) {
      navigate("/", { replace: true });
      return;
    }

    app.changeStep(prevStep.key);
  };

  return (
    <div className={s.actions}>
      <div className={s.mobile_back}>
        <IconButton onClick={handleBack} variant={"outlined"}>
          <BackMarkSVG />
        </IconButton>
      </div>
      <div className={s.button_back}>
        <Button onClick={handleBack} text="Back" />
      </div>
      <Button
        onClick={handleNext}
        text={nextStep ? "Next" : "Finish"}
        variant="contained"
        disabled={!isCanChangeStep}
      />
    </div>
  );
};
