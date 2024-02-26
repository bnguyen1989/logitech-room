import { useDispatch } from "react-redux";
import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  addActiveCard,
  changeValueCard,
} from "../../../../../store/slices/ui/Ui.slice";
import {
  getActiveStep,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import {
  ItemCardI,
  StepCardType,
  StepI,
} from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { StepName } from "../../../../../models/permission/type";
import { SoftwareServiceSection } from "../SoftwareServiceSection/SoftwareServiceSection";

export const ConfigurationFormForStep = () => {
  const dispatch = useDispatch();
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  const onChange = (
    value: StepCardType,
    type: "counter" | "color" | "select"
  ) => {
    if (type === "counter") {
      const counter = (value as ItemCardI).counter;

      const threekit = (value as ItemCardI).threekit;
      if (counter && threekit) {
        app.changeCountItemConfiguration(
          counter.threekit.key,
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
      dispatch(addActiveCard(card));
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
      const activeCards = activeStep?.activeCards || [];
      const currentActiveItem = activeCards.find(
        (item) => item.keyPermission === card.keyPermission
      );
      return (
        <CardItem
          key={index}
          data={card}
          onClick={onClick}
          active={!!currentActiveItem}
          onChange={onChange}
          recommended={false}
        />
      );
    }
    return null;
  };

  if (!activeStep) return null;

  if (activeStep.key === StepName.SoftwareServices) {
    return (
      <SoftwareServiceSection
        handleClickCard={handleClick}
        onChangeValueCard={onChange}
        cards={activeStep.cards}
      />
    );
  }

  return (
    <div className={s.form}>
      {activeStep.cards.map((card, index) => getCardComponent(card, index))}
    </div>
  );
};
