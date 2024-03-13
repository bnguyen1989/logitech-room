import { useDispatch } from "react-redux";
import { CardPlatform } from "../../../../components/Cards/CardPlatform/CardPlatform";
import { CardRoom } from "../../../../components/Cards/CardRoom/CardRoom";
import { CardService } from "../../../../components/Cards/CardService/CardService";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStep,
  getActiveStepData,
  getIsConfiguratorStep,
  getIsSelectedCardByKeyPermission,
  getSelectedCardsByStep,
} from "../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI, StepName } from "../../../../store/slices/ui/type";
import s from "./PrepareSection.module.scss";
import {
  addActiveCard,
  removeActiveCard,
} from "../../../../store/slices/ui/Ui.slice";
import { Application } from "../../../../models/Application";

declare const app: Application;

export const PrepareSection: React.FC = () => {
  const dispatch = useDispatch();
  const state = useAppSelector((state) => state);
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const activeStep = useAppSelector(getActiveStep);
  const selectCards = useAppSelector(getSelectedCardsByStep(activeStep));
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  if (isConfiguratorStep) return null;

  console.log("activeStepData", activeStepData);

  const handleClick = (card: CardI) => {
    const isSelectCard = getIsSelectedCardByKeyPermission(
      activeStep,
      card.keyPermission
    )(state);

    const { attributeName, threekitItems } = card.dataThreekit;
    const threekitAsset = threekitItems[card.keyPermission];

    if (!attributeName.length) {
      if (isSelectCard) {
        dispatch(removeActiveCard({ key: card.keyPermission }));
        return;
      }
      dispatch(addActiveCard({ key: card.keyPermission }));
      return;
    }

    if (isSelectCard) {
      app.removeItem(attributeName, card.keyPermission);
      return;
    }

    app.addItemConfiguration(
      attributeName,
      threekitAsset.id,
      card.keyPermission
    );
  };

  const getCardComponent = (card: CardI, index: number) => {
    const onClick = () => handleClick(card);
    const isActive = selectCards.some(
      (item) => item.keyPermission === card.keyPermission
    );
    const isDisabled = !!selectCards.length && !isActive;
    if (card.key === StepName.Platform) {
      return (
        <CardPlatform
          key={index}
          data={card}
          onClick={onClick}
          active={isActive}
          disabled={isDisabled}
        />
      );
    }
    if (card.key === StepName.RoomSize) {
      return (
        <CardRoom
          key={index}
          data={card}
          onClick={onClick}
          active={isActive}
          disabled={isDisabled}
        />
      );
    }
    if (card.key === StepName.Services) {
      return (
        <CardService
          key={index}
          data={card}
          onClick={onClick}
          active={isActive}
          disabled={isDisabled}
        />
      );
    }
    return null;
  };
  return (
    <div className={s.container}>
      {Object.values(activeStepData.cards).map((card, index) =>
        getCardComponent(card, index)
      )}
    </div>
  );
};
