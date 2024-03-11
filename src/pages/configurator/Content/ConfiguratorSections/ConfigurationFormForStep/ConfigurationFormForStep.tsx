import { useDispatch } from "react-redux";
import { CardItem } from "../../../../../components/Cards/CardItem/CardItem";
import { useAppSelector } from "../../../../../hooks/redux";
import { addActiveCard } from "../../../../../store/slices/ui/Ui.slice";
import {
  getActiveStepData,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import { CardI, StepI } from "../../../../../store/slices/ui/type";
import s from "./ConfigurationFormForStep.module.scss";
import { StepName } from "../../../../../models/permission/type";
import { SoftwareServiceSection } from "../SoftwareServiceSection/SoftwareServiceSection";

export const ConfigurationFormForStep = () => {
  const dispatch = useDispatch();
  const activeStepData: StepI = useAppSelector(getActiveStepData);
  const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);

  const handleClick = (card: CardI) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some(
      (item) => item.name === card.keyPermission
    );
    const threekit = card.threekit;
    if (!threekit) {
      dispatch(addActiveCard({ key: card.keyPermission }));
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
