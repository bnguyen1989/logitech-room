// import { ArrowSelectDownSVG } from "../../../assets";
// import { IconButton } from "../../../components/Buttons/IconButton/IconButton";
import { NavigationMenu } from "../../../components/NavigationMenu/NavigationMenu";
import { useAppSelector } from "../../../hooks/redux";
// import { StepName } from "../../../models/permission/type";
import { getIsBuilding } from "../../../store/slices/configurator/selectors/selectors";
import { getActiveStep } from "../../../store/slices/ui/selectors/selectors";
import s from "./Header.module.scss";

export const Header: React.FC = () => {
  const activeStep = useAppSelector(getActiveStep);
  const isBuilding = useAppSelector(getIsBuilding);

  if (!activeStep) return null;

  // const isStepSoftwareServices = activeStep.key === StepName.SoftwareServices;

  const isConferenceCamera = activeStep?.name
    .toLocaleLowerCase()
    .includes("conference camera");

  if (isBuilding && isConferenceCamera) {
    return (
      <div className={s.container}>
        <div className={s.navigationMenu}>
          <NavigationMenu />
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.navigationMenu}>
        <NavigationMenu />
      </div>
      <div className={s.title}>
        <div className={s.title_text}>{activeStep.title}</div>
        <div className={s.sub_title_text}>{activeStep.subtitle}</div>
      </div>
      {/* <div className={s.actions}>
        {isStepSoftwareServices && (
          <IconButton
            text={"Need help? Anchor link"}
            onClick={() => {}}
            variant={"outlined"}
          >
            <ArrowSelectDownSVG />
          </IconButton>
        )}
      </div> */}
    </div>
  );
};
