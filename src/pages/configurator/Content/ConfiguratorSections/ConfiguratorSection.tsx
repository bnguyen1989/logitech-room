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
import { Application } from '../../../../models/Application'

declare const app: Application;

export const ConfiguratorSection: React.FC = () => {
  const dispatch = useDispatch();
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  if (!activeStep || !isConfiguratorStep) return null;

  const handleClick = (card: StepCardType) => {
    if (card.title === activeStep.currentCard?.title) {
      dispatch(changeActiveCard(undefined));
      return;
    }

    if(card.key === StepName.AudioExtensions) {
      const assetId = (card as ItemCardI).assetId;
      if(assetId) {
        app.addItemConfiguration('Room Mic', assetId);
      }
    }

    
    dispatch(changeActiveCard(card));
  };

  const onChange = (value: StepCardType) => {
    dispatch(changeValueCard(value));
  };

  const getCardComponent = (card: StepCardType, index: number) => {
    const onClick = () => handleClick(card);
    const isActive = activeStep.currentCard?.title === card.title;
    const isConfiguratorCard =
      card.key === StepName.ConferenceCamera ||
      card.key === StepName.AudioExtensions ||
      card.key === StepName.MeetingController ||
      card.key === StepName.SoftwareServices ||
      card.key === StepName.VideoAccessories;
    if (isConfiguratorCard) {
      return (
        <CardItem
          key={index}
          data={card}
          onClick={onClick}
          active={isActive}
          onChange={onChange}
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
