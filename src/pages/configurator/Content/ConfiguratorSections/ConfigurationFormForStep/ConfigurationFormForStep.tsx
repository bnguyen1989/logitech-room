import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getActiveStep,
  getActiveStepData,
  getIsConfiguratorStep,
  getSubCardsKeyPermissionStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { useEffect, useRef } from "react";
import { SubSectionCardItem } from "../SubSectionCardItem/SubSectionCardItem";
import { getTKAnalytics } from "../../../../../utils/getTKAnalytics";
import { StepName } from "../../../../../utils/baseUtils";

export const ConfigurationFormForStep = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const activeStepName = useAppSelector(getActiveStep);
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);
  const subCardKeyPermissions = useAppSelector(
    getSubCardsKeyPermissionStep(activeStepData)
  );

  useEffect(() => {
    getTKAnalytics().stage({ stageName: activeStepName });
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = 0;
  }, [activeStepName]);

  const getCardComponent = (card: CardI, index: number) => {
    if (!isConfiguratorStep) return null;
    const subKeyPermissions = subCardKeyPermissions[card.keyPermission];
    if (!subKeyPermissions || !subKeyPermissions.length) {
      const arrSubKeyPermissions = Object.values(subCardKeyPermissions).flat();
      const isSubSection = arrSubKeyPermissions.includes(card.keyPermission);
      if (!isSubSection) {
        return <CardItem key={index} keyItemPermission={card.keyPermission} />;
      }

      return null;
    }
    return (
      <CardItem key={index} keyItemPermission={card.keyPermission}>
        <SubSectionCardItem
          name={"Accessories"}
          keyPermissionCards={subKeyPermissions}
        />
      </CardItem>
    );
  };
  console.log("activeStepData", activeStepData);

  const listIgnoreSection = [
    StepName.RoomSize,
    StepName.Platform,
    StepName.Services,
  ];
  if (listIgnoreSection.includes(activeStepData.key)) return <></>;
  
  return (
    <div ref={contentRef} className={s.form}>
      {Object.values(activeStepData.cards).map((card, index) =>
        getCardComponent(card, index)
      )}
    </div>
  );
};
