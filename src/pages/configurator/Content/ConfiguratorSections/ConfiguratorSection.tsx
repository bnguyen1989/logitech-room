import { useDispatch } from "react-redux";
import { CardItem } from "../../../../components/Cards/CardItem/CardItem";
import { Player } from "../../../../components/Player/Player";
import { useAppSelector } from "../../../../hooks/redux";
import {
  changeActiveCard,
  changeValueCard,
} from "../../../../store/slices/ui/Ui.slice";
import {
  getActiveStep,
  getIsConfiguratorStep,
} from "../../../../store/slices/ui/selectors/selectors";
import {
  ItemCardI,
  StepCardType,
  StepI,
  StepName,
} from "../../../../store/slices/ui/type";
import s from "./ConfiguratorSection.module.scss";
import { PlayerWidgets } from "../../../../components/PlayerWidgets/PlayerWidgets";
import { Application } from "../../../../models/Application";
import { useEffect, useState } from "react";
import {
  getRoomAssetId,
  initThreekitData,
} from "../../../../utils/threekitUtils";
import { changeAssetId } from "../../../../store/slices/configurator/Configurator.slice";
import { Permission } from '../../../../models/permission/Permission'

declare const app: Application;
declare const permission: Permission;

export const ConfiguratorSection: React.FC = () => {
  const dispatch = useDispatch();
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);
  const [isStartLoadPlayer, setIsStartLoadPlayer] = useState(false);
  

  useEffect(() => {
    if (!activeStep) {
      return;
    }
    setIsStartLoadPlayer(activeStep.key === StepName.Services);

    const activeItems = permission.getActiveItems();
    const cardsCurrentStep = activeStep.cards;
    const activeDefaultItems = activeItems.filter((item) => item.getDefaultActive());
    const cardDefault = cardsCurrentStep.find((card) => activeDefaultItems.some((item) => item.name === card.keyPermission)) as ItemCardI;
    if(cardDefault && cardDefault.threekit) {
      const threekit = cardDefault.threekit;
      app.addItemConfiguration(threekit.key, threekit.assetId);
    }
  }, [activeStep?.key]);

  useEffect(() => {
    if (!isStartLoadPlayer) return;
    const assetId = app.currentConfigurator.assetId;
    if (assetId.length) return;

    console.log('---- INIT THREEKIT DATA ----');
    
    const roomAssetId = getRoomAssetId("", "");
    app.currentConfigurator.assetId = roomAssetId;
    initThreekitData();
    dispatch(changeAssetId(roomAssetId));
  }, [isStartLoadPlayer]);

  if (!activeStep) return null;

  const handleClick = (card: StepCardType) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some((item) => item.name === card.keyPermission);
    const threekit = (card as ItemCardI).threekit;
    if(!threekit) {
      dispatch(changeActiveCard(card));
      return;
    }

    if (isContain && card.keyPermission) {
      app.removeItem(threekit.key, threekit.assetId)
      return;
    }

    app.addItemConfiguration(threekit.key, threekit.assetId);
  };

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

  const getCardComponent = (card: StepCardType, index: number) => {
    if (!isConfiguratorStep) return null;
    const onClick = () => handleClick(card);
    const isConfiguratorCard =
      card.key === StepName.ConferenceCamera ||
      card.key === StepName.AudioExtensions ||
      card.key === StepName.MeetingController ||
      card.key === StepName.SoftwareServices ||
      card.key === StepName.VideoAccessories;
    if (isConfiguratorCard) {
      const activeItems = permission.getActiveItems();
      const currentActiveItem = activeItems.find((item) => item.name === card.keyPermission);
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
    <div className={s.container}>
      <div className={s.player}>
        <Player />
        <div className={s.widgets}>
          <PlayerWidgets />
        </div>
      </div>
      <div className={s.form}>
        {activeStep.cards.map((card, index) => getCardComponent(card, index))}
      </div>
    </div>
  );
};
