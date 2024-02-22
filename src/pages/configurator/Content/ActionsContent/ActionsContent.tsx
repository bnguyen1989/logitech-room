import s from "./ActionsContent.module.scss";

import { IconButton } from "../../../../components/Buttons/IconButton/IconButton";
import { RevertSVG } from "../../../../assets";
import { Button } from "../../../../components/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeActiveStep } from "../../../../store/slices/ui/Ui.slice";
import { setMySetupModal } from "../../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../../hooks/redux";
import { getNavigationStepData } from "../../../../store/slices/ui/selectors/selectors";
import { Permission } from "../../../../models/permission/Permission";


declare const permission: Permission;

export const ActionsContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prevStep, nextStep } = useAppSelector(getNavigationStepData);

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
  );
};
