import { useDispatch } from "react-redux";
import { CardPlatform } from "../../../../components/Cards/CardPlatform/CardPlatform";
import { CardRoom } from "../../../../components/Cards/CardRoom/CardRoom";
import { CardService } from "../../../../components/Cards/CardService/CardService";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStep,
  getActiveStepData,
  getIsConfiguratorStep,
  getSelectedCardsByStep,
} from "../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI, StepName } from "../../../../store/slices/ui/type";
import s from "./PrepareSection.module.scss";
import {
  addActiveCard,
  removeActiveCard,
} from "../../../../store/slices/ui/Ui.slice";
import { Permission } from "../../../../models/permission/Permission";
import { Application } from "../../../../models/Application";

declare const permission: Permission;
declare const app: Application;

export const PrepareSection: React.FC = () => {
  const dispatch = useDispatch();
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const activeStep = useAppSelector(getActiveStep);
  const selectCards = useAppSelector(getSelectedCardsByStep(activeStep));
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  if (isConfiguratorStep) return null;

  console.log("activeStepData", activeStepData);

  const handleClick = (card: CardI) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some(
      (item) => item.name === card.keyPermission
    );
    const threekit = card.threekit;

    if (!threekit) {
      if (card.keyPermission) {
        if (isContain) {
          if (permission.canRemoveActiveItemByName(card.keyPermission)) {
            permission.removeActiveItemByName(card.keyPermission);
            dispatch(removeActiveCard({ key: card.keyPermission }));
          }
          return;
        }
        if (permission.canAddActiveElementByName(card.keyPermission)) {
          permission.addActiveElementByName(card.keyPermission);
          dispatch(addActiveCard({ key: card.keyPermission }));
        }
      }
      return;
    }

    if (isContain && card.keyPermission) {
      app.removeItem(threekit.key, card.keyPermission);
      return;
    }

    app.addItemConfiguration(
      threekit.key,
      threekit.assetId,
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
