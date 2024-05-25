import s from "./ActionsContent.module.scss";
import { Button } from "../../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFinishModal } from "../../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getIsCanChangeStep,
  getIsIncludePlayer,
  getNavigationStepData,
} from "../../../../store/slices/ui/selectors/selectors";
import { Application } from "../../../../models/Application";
import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { BackMarkSVG } from "../../../../assets";
import {
  EventActionName,
  EventCategoryName,
} from "../../../../models/analytics/type";
import { useEffect } from "react";

declare const app: Application;

export const ActionsContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isIncludePlayer = useAppSelector(getIsIncludePlayer);
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isCanChangeStep = useAppSelector(getIsCanChangeStep);

  useEffect(() => {
    const playerContainer = document.getElementById(
      "configurator-section-elementals"
    );
    if (!playerContainer) return;
    if (isIncludePlayer) {
      playerContainer.style.position = "static";
      playerContainer.style.width = "100%";
      playerContainer.style.height = "44.85vh";
      if (window.innerWidth < 1000) {
        playerContainer.style.height = "48.85vh";
      }
      if (window.innerWidth < 720) {
        playerContainer.style.height = "52.85vh";
      }

      return;
    }

    playerContainer.style.position = "relative";
    playerContainer.style.width = "1px";
    playerContainer.style.height = "1px";
  }, [isIncludePlayer]);

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
