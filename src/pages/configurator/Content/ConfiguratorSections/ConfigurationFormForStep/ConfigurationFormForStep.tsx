import { useDispatch } from "react-redux";
import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import { changeActiveCard, changeValueCard } from "../../../../../store/slices/ui/Ui.slice";
import { getActiveStep, getIsConfiguratorStep } from "../../../../../store/slices/ui/selectors/selectors";
import {
  ItemCardI,
  StepCardType,
  StepI,
} from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { StepName } from "../../../../../models/permission/type";

export const ConfigurationFormForStep = () => {
  const dispatch = useDispatch();
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  if (!activeStep) return null;

  const onChange = (
    value: StepCardType,
    type: "counter" | "color" | "select"
  ) => {
    if (type === "counter") {
      const counter = (value as ItemCardI).counter;

      const threekit = (value as ItemCardI).threekit;
      if (counter && threekit) {
        app.changeCountItemConfiguration(
          threekit.key,
          String(counter.currentValue),
          threekit.assetId
        );
      }
      return;
    }

    if (type === "color") {
      const color = (value as ItemCardI).color;
      const threekit = (value as ItemCardI).threekit;
      if (color && threekit) {
        app.changeColorItemConfiguration(
          color.currentColor.value,
          threekit.assetId
        );
      }
    }

    if (type === "select") {
      dispatch(changeValueCard(value));
    }
  };

  const handleClick = (card: StepCardType) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some(
      (item) => item.name === card.keyPermission
    );
    const threekit = (card as ItemCardI).threekit;
    if (!threekit) {
      dispatch(changeActiveCard(card));
      return;
    }

    if (isContain && card.keyPermission) {
      app.removeItem(threekit.key, threekit.assetId);
      return;
    }

    app.addItemConfiguration(threekit.key, threekit.assetId);
  };

  const getCardComponent = (card: StepCardType, index: number) => {
    if (!isConfiguratorStep) return null;
    const onClick = () => handleClick(card);
    const isConfiguratorCard =
      card.key === StepName.ConferenceCamera ||
      card.key === StepName.AudioExtensions ||
      card.key === StepName.MeetingController ||
      card.key === StepName.VideoAccessories;
    if (isConfiguratorCard) {
      const activeItems = permission.getActiveItems();
      const currentActiveItem = activeItems.find(
        (item) => item.name === card.keyPermission
      );
      return (
        <CardItem
          key={index}
          data={card}
          onClick={onClick}
          active={!!currentActiveItem}
          onChange={onChange}
          recommended={currentActiveItem?.getRecommended()}
        />
      );
    }
    return null;
  };

  return (
    <div className={s.form}>
      {activeStep.cards.map((card, index) => getCardComponent(card, index))}
    </div>
  );
};
