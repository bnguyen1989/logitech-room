import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  getActiveStepData,
  getAssetFromCard,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { StepName } from "../../../../../models/permission/type";
import { SoftwareServiceSection } from "../SoftwareServiceSection/SoftwareServiceSection";

export const ConfigurationFormForStep = () => {
  const state = useAppSelector((state) => state);
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  const handleClick = (card: CardI) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some(
      (item) => item.name === card.keyPermission
    );

    const {attributeName} = card.dataThreekit;
    const threekitAsset = getAssetFromCard(card)(state);

    if (isContain && card.keyPermission) {
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
    if (!isConfiguratorStep) return null;
    const onClick = () => handleClick(card);
    return (
      <CardItem
        key={index}
        keyItemPermission={card.keyPermission}
        onClick={onClick}
      />
    );
  };

  if (activeStepData.key === StepName.SoftwareServices) {
    return (
      <SoftwareServiceSection
        handleClickCard={handleClick}
        cards={Object.values(activeStepData.cards)}
      />
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
