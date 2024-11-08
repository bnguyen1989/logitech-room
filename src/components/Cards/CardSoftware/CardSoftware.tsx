import React, { useEffect } from "react";
import s from "./CardSoftware.module.scss";
import { SelectItem } from "../../Fields/SelectItem/SelectItem";
import { InformationSVG } from "../../../assets";
import { IconButton } from "../../Buttons/IconButton/IconButton";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getAssetFromCard,
  getCardByKeyPermission,
  getIsRecommendedCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getMetadataProductNameAssetFromCard,
  getTitleCardByKeyPermission,
} from "../../../store/slices/ui/selectors/selectors";
import {
  getCardLangPage,
  getListSoftwareCardLangByKeyPermission,
  getPrepareDescriptionLangByKeyPermission,
} from "../../../store/slices/ui/selectors/selectoteLangPage";
import { CardContainerSoftware } from "../CardContainerSoftware/CardContainerSoftware";
import { useDispatch } from "react-redux";
import { setAnnotationItemModal } from "../../../store/slices/modals/Modals.slice";
import { SoftwareServicesName } from "../../../utils/permissionUtils";
import { getFormatName } from '../../../utils/productUtils'

interface PropsI {
  keyItemPermission: string;
  autoActive?: boolean;
  onSelectedAnalytics: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

const dataLinkMetadataIfMissing: Record<string, string> = {
  [SoftwareServicesName.EssentialServicePlan]:
    "https://www.logitech.com/business/services-and-software.html#compare-plans",
  [SoftwareServicesName.LogitechSync]:
    "https://www.logitech.com/business/services-and-software.html#compare-plans",
};

export const CardSoftware: React.FC<PropsI> = (props) => {
  const dispatch = useDispatch();
  const { keyItemPermission, autoActive, onClick, children } = props;
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  const productName = useAppSelector(getMetadataProductNameAssetFromCard(card));
  const threekitAsset = useAppSelector(getAssetFromCard(card));
  const title = useAppSelector(
    getTitleCardByKeyPermission(activeStep, keyItemPermission)
  );
  const description = useAppSelector(
    getPrepareDescriptionLangByKeyPermission(keyItemPermission)
  );
  const list = useAppSelector(
    getListSoftwareCardLangByKeyPermission(keyItemPermission)
  );
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );

  const recommended: boolean = useAppSelector(
    getIsRecommendedCardByKeyPermission(activeStep, keyItemPermission)
  );

  const langCard = useAppSelector(getCardLangPage);

  const handleInfo = () => {
    const linkInfo = threekitAsset["metadata"]["linkInfo"];

    if (linkInfo) {
      window.open(linkInfo, "_blank");
    } else if (dataLinkMetadataIfMissing[keyItemPermission]) {
      window.open(dataLinkMetadataIfMissing[keyItemPermission], "_blank");
    } else {
      const name = productName.split("-")[0];
      dispatch(
        setAnnotationItemModal({
          isOpen: true,
          product: name?.trim() || "",
          keyPermission: keyItemPermission,
          card: card,
        })
      );
    }
  };

  const handleClick = () => {
    props.onSelectedAnalytics();

    const { attributeName } = card.dataThreekit;
    const isIncludeSelect = card.select;

    if (isActiveCard && card.keyPermission) {
      app.removeItem(attributeName, card.keyPermission);
      if (isIncludeSelect) {
        app.changeSelectItemConfiguration(
          attributeName,
          "",
          card.keyPermission
        );
      }
      return;
    }

    if (isIncludeSelect) {
      app.changeSelectItemConfiguration(
        attributeName,
        threekitAsset.id,
        card.keyPermission
      );
    } else {
      app.addItemConfiguration(
        attributeName,
        threekitAsset.id,
        card.keyPermission
      );
    }

    onClick && onClick();
  };

  useEffect(() => {
    if (isActiveCard) return;
    if (autoActive) handleClick();
  }, [autoActive]);

  if (!card) return null;

  return (
    <CardContainerSoftware
      onClick={handleClick}
      active={isActiveCard}
      style={{ padding: "0px" }}
      recommended={recommended}
    >
      <div className={s.container}>
        <div className={s.wrapper}>
          {recommended && (
            <div className={s.wrapper_recommended}>
              <div className={s.recommended}>
                <div className={s.text}>{langCard.Text.Recommended}</div>
              </div>
            </div>
          )}
          <div className={s.content}>
            <div className={s.header} onClick={handleClick}>
              {/* <div className={s.header_title}>{card.header_title}</div> */}
              <div className={s.title}>{title}</div>
              {!!card.subtitle && (
                <div className={s.subtitle}>{card.subtitle}</div>
              )}
            </div>
            {list ? (
              <div className={s.list}>
                <div className={s.title_list}>{list.title}</div>
                <ul className={s.items_list}>
                  {Object.values(list.values).map((item, index) => (
                    <li key={index} className={s.item_list}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={s.desc}>{description}</div>
            )}
          </div>
          {!!card.select && (
            <div className={s.actions}>
              <SelectItem
                keyItemPermission={keyItemPermission}
                defaultLabel={langCard.Text.ChooseNumberOfYears}
                dataAnalytics="card-choose-lorem-plan"
                getFormatName={getFormatName(langCard)}
              />
            </div>
          )}
          {children}
          <div className={s.info_mobile}>
            <div
              className={s.info_button_mobile}
              onClick={handleInfo}
              data-analytics-title={"card-show-annotation-modal"}
            >
              INFO
            </div>
          </div>
        </div>
        {keyItemPermission !== SoftwareServicesName.ExtendedWarranty && (
          <div className={s.info}>
            <IconButton
              onClick={handleInfo}
              dataAnalytics={"card-show-annotation-modal"}
            >
              <InformationSVG />
            </IconButton>
          </div>
        )}
      </div>
    </CardContainerSoftware>
  );
};
