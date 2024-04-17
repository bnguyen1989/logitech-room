import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getActiveStep,
  getActiveStepData,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { SoftwareServiceSection } from "../SoftwareServiceSection/SoftwareServiceSection";
import { useEffect, useRef } from "react";
import { StepName } from "../../../../../utils/baseUtils";

export const ConfigurationFormForStep = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const activeStepName = useAppSelector(getActiveStep);
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = 0;
  }, [activeStepName]);

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
    <div ref={contentRef} className={s.form}>
      {Object.values(activeStepData.cards).map((card, index) =>
        getCardComponent(card, index)
      )}
    </div>
  );
};
