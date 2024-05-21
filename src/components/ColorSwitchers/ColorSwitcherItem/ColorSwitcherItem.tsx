import { ColorItemI } from "../../../store/slices/ui/type";
import {
  getActiveStep,
  getCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import { useAppSelector } from "../../../hooks/redux";
import { Application } from "../../../models/Application";
import { ColorSwitcher } from "../ColorSwitcher/ColorSwitcher";
import {
  getColorsFromCard,
  getPropertyColorCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectorsColorsCard";
import { StepName } from "../../../utils/baseUtils";
import { useEffect } from "react";
import { optionsShow } from "../../../utils/analytics/optionsShow";
import { ConfigData } from "../../../utils/threekitUtils";
import { useSession } from "@threekit/react-three-fiber";
import { optionInteraction } from "../../../utils/analytics/optionSelect";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
  disabled?: boolean;
  activeStepProp?: StepName;
}

export const ColorSwitcherItem: React.FC<PropsI> = (props) => {
  const { sessionId } = useSession();
  const auth =  {
    host: ConfigData.host,
    orgId: ConfigData.orgId,
    publicToken: ConfigData.publicToken,
  },
  const { keyItemPermission, disabled, activeStepProp } = props;
  const activeStep = useAppSelector(getActiveStep);
  const activeStepName = activeStepProp ?? activeStep;
  const card = useAppSelector(
    getCardByKeyPermission(activeStepName, keyItemPermission)
  );

  const colorValue = useAppSelector(
    getPropertyColorCardByKeyPermission(activeStepName, keyItemPermission)
  );
  const availableColorsData = useAppSelector(
    getColorsFromCard(activeStepName, keyItemPermission)
  );

  useEffect(() => {
    if (!card) return;
    if (availableColorsData.length < 1) return;

    optionsShow({
      auth,
      options: availableColorsData.map((item) => ({
        optionId: item.name,
        optionName: item.name,
        optionValue: item.value
      })),
      optionsSetKey: keyItemPermission,
      sessionId  
    });
  }, [ card, availableColorsData.length]);

  if (!card) return;
  if (availableColorsData.length < 1) return;

  const handleChange = (value: ColorItemI) => {
    const dataThreekit = card.dataThreekit;
    app.changeColorItemConfiguration(
      dataThreekit.attributeName,
      value.name,
      card.keyPermission
    );

    optionInteraction({
      auth,
      optionId: value.name,
      optionsSetKey: keyItemPermission,
      sessionId
    });
  };

  return (
    <ColorSwitcher
      value={colorValue}
      onChange={handleChange}
      listColors={availableColorsData}
      disabled={disabled}
    />
  );
};
