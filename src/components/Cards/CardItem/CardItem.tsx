import { InformationSVG } from "../../../assets";
import { CardContainer } from "../CardContainer/CardContainer";
import s from "./CardItem.module.scss";
import { ColorSwitcherItem } from "../../ColorSwitchers/ColorSwitcherItem/ColorSwitcherItem";
import { CounterItem } from "../../Counters/CounterItem/CounterItem";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useDispatch } from "react-redux";
import { setInfoItemModal } from "../../../store/slices/modals/Modals.slice";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getIsDisabledActionByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import {
  getLangProductBlade1,
  getLangProductImage,
} from "../../../store/slices/ui/selectors/selectoreLangProduct";

interface PropsI {
  keyItemPermission: string;
}
export const CardItem: React.FC<PropsI> = (props) => {
  const { keyItemPermission } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));
  console.log("card", card);

  const langProduct = useAppSelector(getLangProductBlade1(productName));
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
  const isDisabledActions = useAppSelector(
    getIsDisabledActionByKeyPermission(activeStep, keyItemPermission)
  );
  const dispatch = useDispatch();

  if (!card) return null;

  const handleInfo = () => {
    dispatch(setInfoItemModal({ isOpen: true, product: productName }));
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

  // const isAction = card.counter || card.color || card.select;
  const isAction = card.counter || card.select;

  return (
    <CardContainer
      onClick={handleClick}
      recommended={card.recommended}
      style={{ padding: "25px 20px" }}
      active={isActiveCard}
    >
      <div className={s.container}>
        <div className={s.left_content} onClick={handleClick}>
          <div className={s.image}>
            <img src={langProductImage} alt="item" />
          </div>
        </div>
        <div className={s.right_content}>
          <div className={s.header} onClick={handleClick}>
            {/* <div className={s.header_title}>{card.header_title}</div> */}
            <div className={s.title}>{title}</div>
            {langProduct && !!langProduct.ShortDescription && (
              <div className={s.subtitle}>{langProduct.ShortDescription}</div>
            )}
          </div>
          <div
            className={s.content}
            style={{ borderTop: isAction ? "1px solid #E1E2E3" : "" }}
          >
            <div
              className={s.content_actions}
              style={{ paddingTop: isAction ? "20px" : "" }}
            >
              <ColorSwitcherItem
                keyItemPermission={card.keyPermission}
                disabled={isDisabledActions}
              />
              <CounterItem
                keyItemPermission={card.keyPermission}
                disabled={isDisabledActions}
              />
              <SelectItem
                keyItemPermission={card.keyPermission}
                disabled={!isActiveCard || isDisabledActions}
              />
            </div>
            <div className={s.info}>
              <IconButton onClick={handleInfo}>
                <InformationSVG />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};
