import { CardPlatform } from "../../../../components/Cards/CardPlatform/CardPlatform";
import { CardRoom } from "../../../../components/Cards/CardRoom/CardRoom";
import { CardService } from "../../../../components/Cards/CardService/CardService";
import { useAppSelector } from "../../../../hooks/redux";
import {
  getActiveStepData,
  getIsConfiguratorStep,
} from "../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../store/slices/ui/type";
import { StepName } from "../../../../utils/baseUtils";
import s from "./PrepareSection.module.scss";

export const PrepareSection: React.FC = () => {
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  if (isConfiguratorStep) return null;

  const getCardComponent = (card: CardI, index: number) => {
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
  return (
    <div className={s.container}>
      <div className={s.wrapperCards}>
        {Object.values(activeStepData.cards).map((card, index) =>
          getCardComponent(card, index)
        )}
      </div>
    </div>
  );
};
