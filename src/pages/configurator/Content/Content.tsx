import s from "./Content.module.scss";
import { Button } from "../../../components/Buttons/Button/Button";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getIsProcessInitData,
  getNavigationStepData,
} from "../../../store/slices/ui/selectors/selectors";
import React from "react";
import { useDispatch } from "react-redux";
import { changeActiveStep } from "../../../store/slices/ui/Ui.slice";
import { PrepareSection } from "./PrepareSections/PrepareSection";
import { ConfiguratorSection } from "./ConfiguratorSections/ConfiguratorSection";
import { getIsBuilding } from "../../../store/slices/configurator/selectors/selectors";
import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { RevertSVG } from "../../../assets";
import { setMySetupModal } from "../../../store/slices/modals/Modals.slice";
import { Permission } from "../../../models/permission/Permission";
import { useNavigate } from "react-router-dom";
import { LoaderSection } from "./LoaderSection/LoaderSection";

declare const permission: Permission;

interface PropsI {}
export const Content: React.FC<PropsI> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);
  const isBuilding = useAppSelector(getIsBuilding);
  const isProcessInitData = useAppSelector(getIsProcessInitData);

  const isConferenceCamera = activeStep?.name
    .toLocaleLowerCase()
    .includes("conference camera");

  const handleNext = () => {
    if (!nextStep) {
      dispatch(setMySetupModal({ isOpen: true }));
      return;
    }

    dispatch(changeActiveStep(nextStep));
  };

  const handleBack = () => {
    if (!prevStep) {
      navigate("/", { replace: true });
      return;
    }
    dispatch(changeActiveStep(prevStep));
  };

  const handleRevert = () => {
    navigate("/", { replace: true });
  };

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
          text={nextStep ? "Next" : "Finish"}
          variant="contained"
          disabled={!permission.canNextStep()}
        />
      </div>
      {(isBuilding || isProcessInitData) && isConferenceCamera && (
        <div className={s.loader}>
          <LoaderSection />
        </div>
      )}
    </div>
  );
};
