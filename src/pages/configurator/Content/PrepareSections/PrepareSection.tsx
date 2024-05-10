import { CardPlatform } from "../../../../components/Cards/CardPlatform/CardPlatform";
import { CardRoom } from "../../../../components/Cards/CardRoom/CardRoom";
import { CardService } from "../../../../components/Cards/CardService/CardService";
import { PrepareSecondaryCard } from "../../../../components/Cards/PrepareSecondaryCard/PrepareSecondaryCard";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStepData,
  getIsConfiguratorStep,
  getSecondaryCardsFromStep,
} from "../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../store/slices/ui/type";
import { StepName } from "../../../../utils/baseUtils";
import s from "./PrepareSection.module.scss";

export const PrepareSection: React.FC = () => {
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);
  const secondaryCards = useAppSelector(
    getSecondaryCardsFromStep(activeStepData)
  );

  if (isConfiguratorStep) return null;

  const getCardComponent = (card: CardI, index: number) => {
    const isExistSecondary = secondaryCards.some(
      (item) => item.keyPermission === card.keyPermission
    );
    if (isExistSecondary) return null;

    if (card.key === StepName.Platform) {
      return (
        <CardPlatform key={index} keyItemPermission={card.keyPermission} />
      );
    }
    if (card.key === StepName.RoomSize) {
      return <CardRoom key={index} keyItemPermission={card.keyPermission} />;
    }
    if (card.key === StepName.Services) {
      return <CardService key={index} keyItemPermission={card.keyPermission} />;
    }
    return null;
  };

  const isSecondaryCards = !!secondaryCards.length;
  return (
    <div className={s.container}>
      <div className={isSecondaryCards ? s.wrapper_scroll : s.wrapper}>
        <div className={s.wrapperCards}>
          {Object.values(activeStepData.cards).map((card, index) =>
            getCardComponent(card, index)
          )}
        </div>
        {isSecondaryCards && (
          <div className={s.secondaryWrapper}>
            <div className={s.titleSecond}>
              Not quite what you’re looking for?
            </div>
            <div className={s.secondaryWrapperCards}>
              {secondaryCards.map((card, index) => (
                <PrepareSecondaryCard
                  key={index}
                  keyItemPermission={card.keyPermission}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
