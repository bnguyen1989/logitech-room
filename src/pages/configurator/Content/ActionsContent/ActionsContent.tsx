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
import { DirectionStep, StepName } from "../../../../utils/baseUtils";
import { getNavigationLangPage } from "../../../../store/slices/ui/selectors/selectoteLangPage";
import { getDataCamera } from "../../../../store/slices/configurator/selectors/selectors";
import { useQuestionForm } from "../../../../hooks/questionForm";

declare const app: Application;

export const ActionsContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isCanChangeStep = useAppSelector(getIsCanChangeStep);
  const dataCamera = useAppSelector(getDataCamera);
  const questionForm = useQuestionForm();

  const langPage = useAppSelector(getNavigationLangPage);

  const handleNext = () => {
    app.analyticsEvent({
      category: EventCategoryName.threekit_configurator,
      action: EventActionName.step_complete,
      value: {},
    });

    if (!nextStep) {
      dispatch(setFinishModal({ isOpen: true }));
      return;
    }

    if (
      dataCamera &&
      dataCamera?.position &&
      nextStep.key === StepName.ConferenceCamera
    ) {
      app.resetCameraEvent(dataCamera);
    }

    app.changeStep(nextStep.key, DirectionStep.Next);
  };

  const handleBack = () => {
    app.analyticsEvent({
      category: EventCategoryName.threekit_configurator,
      action: EventActionName.back_step,
      value: {},
    });

    if (!prevStep) {
      navigate("/", { replace: true });
      return;
    }

    if (questionForm.data.isSubmit) {
      questionForm.setStatusForm(false);
      return;
    }

    app.changeStep(prevStep.key, DirectionStep.Prev);
  };

  return (
    <div className={s.actions}>
      <div className={s.mobile_back}>
        <IconButton onClick={handleBack} variant={"outlined"}>
          <BackMarkSVG />
        </IconButton>
      </div>
      <div className={s.button_back}>
        <Button
          onClick={handleBack}
          text={langPage.Back}
          dataAnalytics={"back"}
        />
      </div>
      <div className={s.button_next}>
        <Button
          onClick={handleNext}
          text={nextStep ? langPage.Next : langPage.Finish}
          variant="contained"
          disabled={!isCanChangeStep}
          dataAnalytics={"next"}
        />
      </div>
    </div>
  );
};
