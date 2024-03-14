import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getActiveStepData,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { StepName } from "../../../../../models/permission/type";
import { SoftwareServiceSection } from "../SoftwareServiceSection/SoftwareServiceSection";

export const ConfigurationFormForStep = () => {
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  const getCardComponent = (card: CardI, index: number) => {
    if (!isConfiguratorStep) return null;
    return <CardItem key={index} keyItemPermission={card.keyPermission} />;
  };

  if (activeStepData.key === StepName.SoftwareServices) {
    return (
      <SoftwareServiceSection cards={Object.values(activeStepData.cards)} />
    );
  }

  return (
    <div className={s.form}>
      {Object.values(activeStepData.cards).map((card, index) =>
        getCardComponent(card, index)
      )}
    </div>
  );
};
