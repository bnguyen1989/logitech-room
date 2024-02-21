import { useDispatch } from "react-redux";
import { ArrowSelectDownSVG } from "../../../../../assets";
import { IconButton } from "../../../../../components/Buttons/IconButton/IconButton";
import { CardSoftware } from "../../../../../components/Cards/CardSoftware/CardSoftware";
import { QuestionForm } from "../../../../../components/QuestionForm/QuestionForm";
import { useAppSelector } from "../../../../../hooks/redux";
import {
  changeActiveCard,
  changeValueCard,
} from "../../../../../store/slices/ui/Ui.slice";
import {
  getActiveStep,
  getIsConfiguratorStep,
} from "../../../../../store/slices/ui/selectors/selectors";
import {
  ItemCardI,
  StepCardType,
  StepI,
  StepName,
} from "../../../../../store/slices/ui/type";
import s from "./SoftwareServiceSection.module.scss";
import {
  getRoomAssetId,
  initThreekitData,
} from "../../../../../utils/threekitUtils";
import { changeAssetId } from "../../../../../store/slices/configurator/Configurator.slice";
import { useEffect, useState } from "react";

interface PropsI {
  // handleClickCard: (card: StepCardType) => void;
  // onChangeValueCard: (card: StepCardType, type: "select") => void;
  // cards: StepCardType[];
}
export const SoftwareServiceSection: React.FC<PropsI> = () => {
  const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);

  const dispatch = useDispatch();
  // const isConfiguratorStep = useAppSelector(getIsConfiguratorStep);
  const [isStartLoadPlayer, setIsStartLoadPlayer] = useState(false);

  const handleClickCard = (card: StepCardType) => {
    const activeItems = permission.getActiveItems();
    const isContain = activeItems.some(
      (item) => item.name === card.keyPermission
    );
    const threekit = (card as ItemCardI).threekit;
    if (!threekit) {
      dispatch(changeActiveCard(card));
      return;
    }

    if (isContain && card.keyPermission) {
      app.removeItem(threekit.key, threekit.assetId);
      return;
    }

    app.addItemConfiguration(threekit.key, threekit.assetId);
  };

  const onChangeValueCard = (
    value: StepCardType,
    type: "counter" | "color" | "select"
  ) => {
    if (type === "counter") {
      const counter = (value as ItemCardI).counter;

      const threekit = (value as ItemCardI).threekit;
      if (counter && threekit) {
        app.changeCountItemConfiguration(
          threekit.key,
          String(counter.currentValue),
          threekit.assetId
        );
      }
      return;
    }

    if (type === "color") {
      const color = (value as ItemCardI).color;
      const threekit = (value as ItemCardI).threekit;
      if (color && threekit) {
        app.changeColorItemConfiguration(
          color.currentColor.value,
          threekit.assetId
        );
      }
    }

    if (type === "select") {
      dispatch(changeValueCard(value));
    }
  };

  const getCardComponent = (card: StepCardType, index: number) => {
    const onClick = () => handleClickCard(card);
    const isSoftwareServicesCard = card.key === StepName.SoftwareServices;
    if (isSoftwareServicesCard) {
      const activeItems = permission.getActiveItems();
      const currentActiveItem = activeItems.find(
        (item) => item.name === card.keyPermission
      );
      return (
        <CardSoftware
          key={index}
          data={card}
          onClick={onClick}
          active={!!currentActiveItem}
          onChange={onChangeValueCard}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    if (!activeStep) {
      return;
    }
    setIsStartLoadPlayer(activeStep.key === StepName.Services);

    const activeItems = permission.getActiveItems();
    const cardsCurrentStep = activeStep.cards;
    const activeDefaultItems = activeItems.filter((item) =>
      item.getDefaultActive()
    );
    const cardDefault = cardsCurrentStep.find((card) =>
      activeDefaultItems.some((item) => item.name === card.keyPermission)
    ) as ItemCardI;
    if (cardDefault && cardDefault.threekit) {
      const threekit = cardDefault.threekit;
      app.addItemConfiguration(threekit.key, threekit.assetId);
    }
  }, [activeStep?.key]);

  useEffect(() => {
    if (!isStartLoadPlayer) return;
    const assetId = app.currentConfigurator.assetId;
    if (assetId.length) return;

    console.log("---- INIT THREEKIT DATA ----");

    const roomAssetId = getRoomAssetId("", "");
    app.currentConfigurator.assetId = roomAssetId;
    initThreekitData();
    dispatch(changeAssetId(roomAssetId));
  }, [isStartLoadPlayer]);

  if (!activeStep) return null;

  if (activeStep.key === StepName.SoftwareServices) {
    return (
      <div className={s.container}>
        <div className={s.button_link}>
          <div className={s.actions}>
            <IconButton
              text={"Need help? Anchor link"}
              onClick={() => {}}
              variant={"outlined"}
            >
              <ArrowSelectDownSVG />
            </IconButton>
          </div>
        </div>
        <div className={s.cards}>
          {activeStep.cards.map((card, index) => getCardComponent(card, index))}
        </div>
        <div className={s.form}>
          <QuestionForm />
        </div>
      </div>
    );
  }

  return <></>;
};
