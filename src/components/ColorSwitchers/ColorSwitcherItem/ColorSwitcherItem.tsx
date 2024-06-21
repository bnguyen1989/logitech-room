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
import { ColorName, StepName } from "../../../utils/baseUtils";
import { useEffect } from "react";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";
import { OptionInteractionType, OptionsType } from "@threekit/rest-api";
import { getColorsLangPage } from "../../../store/slices/ui/selectors/selectoteLangPage";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
  disabled?: boolean;
  hidden?: boolean;
  activeStepProp?: StepName;
  dataAnalytics?: string;
}

export const ColorSwitcherItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission, disabled, activeStepProp, hidden, dataAnalytics } =
    props;
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

  const langPage = useAppSelector(getColorsLangPage);

  useEffect(() => {
    if (!card) return;
    if (availableColorsData.length < 1) return;

    getTKAnalytics().optionsShow({
      optionsSetId: keyItemPermission + " [ColorSwitcher]",
      optionsType: OptionsType.Value,
      options: availableColorsData.map((item) => ({
        optionId: item.name,
        optionName: item.name,
        optionValue: item.value,
      })),
    });
  }, [card, availableColorsData.length]);

  if (hidden) {
    console.log("cards", card);
  }

  if (hidden) return;
  if (!card) return;
  if (availableColorsData.length < 1) return;

  const handleChange = (value: ColorItemI) => {
    const dataThreekit = card.dataThreekit;
    app.changeColorItemConfiguration(
      dataThreekit.attributeName,
      value.name,
      card.keyPermission
    );

    getTKAnalytics().optionInteraction({
      optionsSetId: keyItemPermission + " [ColorSwitcher]",
      optionId: value.name,
      interactionType: OptionInteractionType.Select,
    });
  };

  const getFormattingName = () => {
    if (colorValue === ColorName.Graphite) return langPage.Graphite;
    if (colorValue === ColorName.White) return langPage.White;
    return;
  };

  return (
    <ColorSwitcher
      value={colorValue}
      onChange={handleChange}
      listColors={availableColorsData}
      disabled={disabled}
      dataAnalytics={dataAnalytics}
      formattingName={getFormattingName()}
    />
  );
};
