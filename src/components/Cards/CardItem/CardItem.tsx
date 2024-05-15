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
  getIsRecommendedCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getSubTitleCardByKeyPermission,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import {
  getLangProductCard,
  getLangProductImage,
} from "../../../store/slices/ui/selectors/selectoreLangProduct";
import { getColorsFromCard } from "../../../store/slices/ui/selectors/selectorsColorsCard";

interface PropsI {
  keyItemPermission: string;
  children?: React.ReactNode;
  type?: "subSection";
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission, children, type } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));

  const langDataCard = useAppSelector(getLangProductCard(productName));

  const langProductImage = useAppSelector(
    getLangProductImage(productName, keyItemPermission)
  );

  const threekitAsset = useAppSelector(getAssetFromCard(card));

  console.log("langProduct");

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
  const recommended: boolean = useAppSelector(
    getIsRecommendedCardByKeyPermission(activeStep, keyItemPermission)
  );
  const availableColorsData = useAppSelector(
    getColorsFromCard(keyItemPermission)
  );
  const dispatch = useDispatch();

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

  const isAction =
    card.counter || card.select || availableColorsData.length > 1;

  const getClassNameCardContainer = () => {
    if (type !== "subSection")
      return `${s.card_container} ${s.card_container_mobile}`;

    return `${s.card_container_sub} ${
      isActiveCard ? s.card_container_sub_active : ""
    } ${s.card_container_mobile}`;
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
              {langDataCard && (
                <div className={s.title}>{langDataCard.ShortDescription}</div>
              )}
              <div className={s.subtitle}>{subTitle}</div>
            </div>
            <div
              className={`${s.content} ${isAction ? s.content_actions : ""}`}
            >
              {isAction && (
                <div className={s.actions}>
                  <ColorSwitcherItem
                    keyItemPermission={card.keyPermission}
                    disabled={disabledActions.color}
                  />
                  <CounterItem
                    keyItemPermission={card.keyPermission}
                    disabled={disabledActions.counter}
                  />
                  <SelectItem
                    keyItemPermission={card.keyPermission}
                    disabled={!isActiveCard}
                  />
                </div>
              )}
              <div className={s.info}>
                <IconButton onClick={handleInfo}>
                  <InformationSVG />
                </IconButton>
              </div>
              <div className={s.info_mobile} onClick={handleInfo}>
                INFO
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </CardContainer>
  );
};
