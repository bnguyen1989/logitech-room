import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import { ColorSwitcherItem } from "../../ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";
import { CounterItem } from "../../Counters/CounterItem/CounterItem";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getDisabledActionByKeyPermission,
  getHiddenActionByKeyPermission,
  getIsRecommendedCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getSubTitleCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import {
  getLangDescriptionForCard,
  getLangProductImage,
} from "../../../store/slices/ui/selectors/selectoreLangProduct";
import { getColorsFromCard } from "../../../store/slices/ui/selectors/selectorsColorsCard";
import { useEffect } from "react";
import { OptionInteractionType, OptionsType } from "@threekit/rest-api";
import { getTKAnalytics } from "../../../utils/getTKAnalytics";
import { DisplayToggle } from "../../DisplayToggle/DisplayToggle";

interface PropsI {
  keyItemPermission: string;
  children?: React.ReactNode;
  type?: "subSection";
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission, children, type } = props;

  useEffect(() => {
    getTKAnalytics().optionsShow({
      optionsSetId: keyItemPermission + " [Checkbox]",
      optionsType: OptionsType.Value,
      options: [
        {
          optionId: "true",
          optionName: "true",
          optionValue: "true",
        },
        {
          optionId: "false",
          optionName: "false",
          optionValue: "false",
        },
      ],
    });
  }, []);

  const activeStep = useAppSelector(getActiveStep);

  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));

  const description = useAppSelector(getLangDescriptionForCard(card));

  const langProductImage = useAppSelector(
    getLangProductImage(productName, keyItemPermission)
  );

  const threekitAsset = useAppSelector(getAssetFromCard(card));

  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const subTitle = useAppSelector(
    getSubTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const disabledActions = useAppSelector(
    getDisabledActionByKeyPermission(activeStep, keyItemPermission)
  );
  const hiddenActions = useAppSelector(
    getHiddenActionByKeyPermission(activeStep, keyItemPermission)
  );
  const recommended: boolean = useAppSelector(
    getIsRecommendedCardByKeyPermission(activeStep, keyItemPermission)
  );
  const availableColorsData = useAppSelector(
    getColorsFromCard(activeStep, keyItemPermission)
  );
  const dispatch = useDispatch();

  console.log("disabledActions", disabledActions);
  

  if (!card) return null;

  const handleInfo = () => {
    dispatch(
      setAnnotationItemModal({
        isOpen: true,
        product: productName,
        keyPermission: keyItemPermission,
        card: card,
      })
    );
  };

  const handleClick = () => {
    const { attributeName } = card.dataThreekit;

    getTKAnalytics().optionInteraction({
      optionsSetId: keyItemPermission + " [Checkbox]",
      optionId: String(!isActiveCard),
      interactionType: OptionInteractionType.Select,
    });

    if (isActiveCard && card.keyPermission) {
      app.removeItem(attributeName, card.keyPermission);
      return;
    }

    app.addItemConfiguration(
      attributeName,
      threekitAsset.id,
      card.keyPermission
    );
  };

  const isShowColor = !hiddenActions.color && availableColorsData.length > 1;

  const isShowDisplayToggle = !hiddenActions.display;

  const isAction = card.counter || card.select || isShowColor;

  const getClassNameCardContainer = () => {
    if (type !== "subSection") return `${s.card_container}`;

    return `${s.card_container_sub} ${
      isActiveCard ? s.card_container_sub_active : ""
    }`;
  };

  return (
    <CardContainer
      onClick={handleClick}
      recommended={recommended}
      className={getClassNameCardContainer()}
      active={isActiveCard}
    >
      <div className={s.container}>
        <div className={s.wrapper}>
          <div className={s.left_content} onClick={handleClick}>
            <div className={s.image}>
              <img src={langProductImage} alt="item" />
            </div>
          </div>
          <div className={s.right_content}>
            <div className={s.header} onClick={handleClick}>
              <div className={s.header_title}>{title}</div>
              {description && <div className={s.title}>{description}</div>}
              {!!subTitle?.length && (
                <div className={s.subtitle}>{subTitle}</div>
              )}
            </div>
            {isShowDisplayToggle && (
              <DisplayToggle
                disabled={!isActiveCard || disabledActions.display}
              />
            )}
            {isAction && <div className={s.divider}></div>}
            <div className={s.content}>
              {isAction && (
                <div className={s.actions}>
                  <ColorSwitcherItem
                    keyItemPermission={card.keyPermission}
                    disabled={disabledActions.color}
                    hidden={hiddenActions.color}
                    dataAnalytics={"card-change-color"}
                  />
                  <CounterItem
                    keyItemPermission={card.keyPermission}
                    disabled={disabledActions.counter}
                    dataAnalytics={"card-change-counter"}
                  />
                  <SelectItem
                    keyItemPermission={card.keyPermission}
                    disabled={!isActiveCard}
                  />
                </div>
              )}
              <div className={s.info}>
                <IconButton
                  onClick={handleInfo}
                  dataAnalytics={"card-show-annotation-modal"}
                >
                  <InformationSVG />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {isActiveCard ? children : null}
      </div>
    </CardContainer>
  );
};
